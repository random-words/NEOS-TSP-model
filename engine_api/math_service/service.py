import os
import uuid
import pandas as pd
from pyomo.environ import value

from .math_model.tsp_runner import KCycleTSPRunner


class KCycleTSPService:
    def run(self, payload: dict) -> dict:
        request_id = str(uuid.uuid4())

        try:
            # --- 1) забираем поля по контракту ---
            all_nodes = payload["allNodes"]
            start_node = payload["startNode"]

            number_of_nodes = int(payload["numberOfNodes"])
            group_size = int(payload["groupSize"])

            budget_max_cents = int(payload["budgetMax"])
            time_max_minutes = int(payload["timeMax"])
            dist_max_km = payload.get("distanceMax", None)

            route_pace = float(payload["routePace"])
            objective_fn = payload["objectiveFunction"]


            budget_max_uah = budget_max_cents


            df = pd.DataFrame(all_nodes).copy()

            # приводим id к int (раннер у тебя делает это)
            df["id"] = pd.to_numeric(df["id"], errors="coerce")
            df["lat"] = pd.to_numeric(df["lat"], errors="coerce")
            df["lon"] = pd.to_numeric(df["lon"], errors="coerce")
            df["avgStayMinutes"] = pd.to_numeric(df.get("avgStayMinutes", 0), errors="coerce").fillna(0.0)

            df = df.dropna(subset=["id", "lat", "lon"]).copy()
            df["id"] = df["id"].astype(int)
            df = df.sort_values("id").reset_index(drop=True)


            s_value = int(start_node["id"])
            k_value = max(1, number_of_nodes - 1)


            nodes_count = df["id"].nunique()
            if k_value > nodes_count - 1:
                k_value = nodes_count - 1


            runner = KCycleTSPRunner()





            runner.load_data_from_dataframe(df=df, s_value=s_value, k_value=k_value)

            runner.build_model(
                CONNECTIVITY="hybrid",
                group_size=group_size,
                speed_kmph=50.0,
                route_pace=route_pace,
                fuel_consumption=0,
                fuel_price=0,
            )

            # --- 5) постановка по objectiveFunction ---
            if objective_fn == "min_distance":
                runner.apply_min_distance(budget_max=budget_max_uah, time_max=time_max_minutes)
            elif objective_fn == "min_budget":
                runner.apply_min_budget(time_max=time_max_minutes, dist_max=dist_max_km)
            elif objective_fn == "min_time":
                runner.apply_min_time(budget_max=budget_max_uah, dist_max=dist_max_km)
            else:
                return {
                    "objective": 0.0,
                    "totalDistance": 0.0,
                    "totalBudget": 0.0,
                    "locationsCost": 0.0,
                    "fuelCost": 0.0,
                    "totalTime": 0.0,
                    "tour": [],
                    "resCode": 400,
                    "resMessage": f"Unknown objectiveFunction={objective_fn}",
                }

            results, ok = runner.solve(SOLVER="cplex", NEOS_EMAIL=os.getenv("NEOS_EMAIL", ""), tee=False)
            if not ok:
                return {
                    "objective": 0.0,
                    "totalDistance": 0.0,
                    "totalBudget": 0.0,
                    "locationsCost": 0.0,
                    "fuelCost": 0.0,
                    "totalTime": 0.0,
                    "tour": [],
                    "resCode": 500,
                    "resMessage": f"Solver failed: {results.solver.status} / {results.solver.termination_condition}",
                }

            tour_ids = runner.extract_tour()

            model = runner.model
            obj_val = float(value(model.obj if hasattr(model, "obj") else model.dk_min))

            total_distance = float(value(model.total_distance))
            total_budget_uah = float(value(model.total_budget))
            total_time = float(value(model.total_time))

            # costs split (если attach_budget добавляет location_cost/travel_cost)
            locations_cost_uah = float(value(getattr(model, "location_cost", 0.0)))
            fuel_cost_uah = float(value(getattr(model, "travel_cost", 0.0)))

            # --- 6) формируем tour как список объектов по контракту ---
            # map id -> node info
            node_map = {int(r["id"]): r for r in all_nodes}

            tour = []
            for nid in tour_ids:
                nid_int = int(nid)
                n = node_map.get(nid_int)
                if not n:
                    # если вдруг нет (не должно), пропустим
                    continue
                tour.append({
                    "id": str(n["id"]),
                    "name": n["name"],
                    "lat": float(n["lat"]),
                    "lon": float(n["lon"]),
                })

            return {
                "objective": obj_val,
                "totalDistance": total_distance,
                "totalBudget": total_budget_uah,
                "locationsCost": locations_cost_uah,
                "fuelCost": fuel_cost_uah,
                "totalTime": total_time,
                "tour": tour,
                "resCode": 200,
                "resMessage": f"OK (request_id={request_id})",
            }

        except Exception as e:
            return {
                "objective": 0.0,
                "totalDistance": 0.0,
                "totalBudget": 0.0,
                "locationsCost": 0.0,
                "fuelCost": 0.0,
                "totalTime": 0.0,
                "tour": [],
                "resCode": 500,
                "resMessage": f"Unhandled error (request_id={request_id}): {e}",
            }

