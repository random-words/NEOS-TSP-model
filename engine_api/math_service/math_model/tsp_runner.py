import os
import pandas as pd
from pyomo.environ import Constraint, Objective, minimize, value
from pyomo.opt import TerminationCondition

from engine_api.math_service.math_model.tsp_helpers import (
    load_geo_dataframe, load_tsplib_data,
    build_distance_matrix, coords_dict,
    selected_edges_from_model, reconstruct_tour,
    plot_tsp_tour, solve_on_neos
)

from engine_api.math_service.math_model.tsp_model_kcycle import (
    create_tsp_model, set_connectivity,
    attach_total_distance, attach_budget, attach_time
)



class KCycleTSPRunner:
    """
    Базова обгортка над 01/02/03 ноутбуком:
    - load data (excel/tsplib)
    - build model (k-cycle + connectivity)
    - attach expressions (distance/budget/time)
    - apply objective + constraints
    - solve via NEOS
    - extract tour + plot
    """

    def __init__(self):
        self.df = None
        self.nodes = None
        self.xcoord_data = None
        self.ycoord_data = None
        self.cost_per_person = None
        self.stay_minutes = None
        self.d_data = None
        self.model = None

        self.results = None
        self.ok = None
        self.tour = None

        self.s_value = None
        self.k_value = None

    def add_check_ranges(self, df):
        """Додає check_min/check_max за логікою min–max (на 1 людину)."""
        df = df.copy()

        for col in ["priceLevel", "avgTastingPricePerPerson", "avgMealPricePerPerson", "avgBottlePrice"]:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")

        def compute_row(row):
            price = row.get("priceLevel", None)
            t = row.get("avgTastingPricePerPerson", None)
            m = row.get("avgMealPricePerPerson", None)
            b = row.get("avgBottlePrice", None)

            vals = []
            for v in [price, t, m, b]:
                if v is not None and pd.notna(v):
                    vals.append(float(v))

            if not vals:
                return pd.Series({"check_min": float("nan"), "check_max": float("nan")})

            light = min(vals)
            full = sum(float(v) for v in [t, m, b] if v is not None and pd.notna(v))

            candidates = []
            if pd.notna(price):
                candidates.append(float(price))
            candidates.append(full)

            heavy = max(candidates) if candidates else light
            return pd.Series({"check_min": min(light, heavy), "check_max": heavy})

        df[["check_min", "check_max"]] = df.apply(compute_row, axis=1)
        return df

    # ----------------------------
    # DATA LOADING
    # ----------------------------
    def load_data(
        self,
        DATA_SOURCE,
        EXCEL_PATH,
        TSPLIB_PATH,
        s_value,
        k_value
    ):
        if DATA_SOURCE == "excel":
            df = pd.read_excel(EXCEL_PATH)

            # чистимо ключові поля
            for col in ["id", "lat", "lon", "avgStayMinutes"]:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors="coerce")

            df = df.dropna(subset=["id", "lat", "lon"]).copy()
            df["id"] = df["id"].astype(int)
            df = df.sort_values("id").reset_index(drop=True)

            # 1) координати (geo -> euclid)
            nodes, xcoord_data, ycoord_data = load_geo_dataframe(
                df, id_col="id", lat_col="lat", lon_col="lon", R=6371.0
            )

            # 2) check_min/check_max + cost per person
            df = self.add_check_ranges(df)

            df["cost_pp"] = df["check_max"]

            df["cost_pp"] = pd.to_numeric(df["cost_pp"], errors="coerce").fillna(0.0)
            cost_per_person = dict(zip(df["id"], df["cost_pp"]))

            # 3) stay time (minutes)
            if "avgStayMinutes" in df.columns:
                df["avgStayMinutes"] = pd.to_numeric(df["avgStayMinutes"], errors="coerce").fillna(0.0)
                stay_minutes = dict(zip(df["id"], df["avgStayMinutes"]))
            else:
                stay_minutes = {i: 0.0 for i in nodes}

            # print("Loaded from Excel:", EXCEL_PATH, "| nodes:", len(nodes))

        elif DATA_SOURCE == "tsplib":
            nodes, xcoord_data, ycoord_data = load_tsplib_data(TSPLIB_PATH)
            cost_per_person = {i: 0.0 for i in nodes}
            stay_minutes = {i: 0.0 for i in nodes}
            df = None
            # print("Loaded from TSPLIB:", TSPLIB_PATH, "| nodes:", len(nodes))
        else:
            raise ValueError("DATA_SOURCE must be 'excel' or 'tsplib'")

        # safety: якщо s не існує — беремо min(nodes)
        if s_value not in nodes:
            s_value = min(nodes)
            print("Adjusted s_value to:", s_value)

        # k має бути <= |nodes|-1
        if k_value > len(nodes) - 1:
            k_value = len(nodes) - 1
            print("Adjusted k_value to:", k_value)

        # зберігаємо в self
        self.df = df
        self.nodes = nodes
        self.xcoord_data = xcoord_data
        self.ycoord_data = ycoord_data
        self.cost_per_person = cost_per_person
        self.stay_minutes = stay_minutes

        self.s_value = s_value
        self.k_value = k_value

        return nodes, xcoord_data, ycoord_data, cost_per_person, stay_minutes

    # ----------------------------
    # MODEL BUILD
    # ----------------------------
    def build_model(self, CONNECTIVITY, group_size, speed_kmph, route_pace,
                    fuel_consumption=0, fuel_price=0):
        nodes = self.nodes
        xcoord_data = self.xcoord_data
        ycoord_data = self.ycoord_data

        s_value = self.s_value
        k_value = self.k_value

        d_data = build_distance_matrix(nodes, xcoord_data, ycoord_data, rounding=2)
        # print("Distance matrix elements:", len(d_data))

        model = create_tsp_model(
            nodes=nodes,
            s=s_value,
            k=k_value,
            xcoord_data=xcoord_data,
            ycoord_data=ycoord_data,
            d_data=d_data
        )

        set_connectivity(model, CONNECTIVITY)

        # expressions for constraints / reporting
        attach_total_distance(model)
        attach_budget(model, self.cost_per_person, group_size=group_size,
                      fuel_consumption_l_100km=fuel_consumption, fuel_price_uah_l=fuel_price)
        attach_time(model, route_pace=route_pace, speed_kmph=speed_kmph)

        self.d_data = d_data
        self.model = model
        return model

    # ----------------------------
    # APPLY постановки (01 / 02 / 03)
    # ----------------------------
    def apply_min_distance(self, budget_max, time_max):
        model = self.model

        if hasattr(model, "obj"):
            model.obj.deactivate()
        model.dk_min.activate()

        if hasattr(model, "con_budget"):
            model.del_component(model.con_budget)
        if hasattr(model, "con_time"):
            model.del_component(model.con_time)

        model.con_budget = Constraint(expr=model.total_budget <= float(budget_max))
        model.con_time = Constraint(expr=model.total_time <= float(time_max))

        return model

    def apply_min_budget(self, time_max, dist_max=None):
        model = self.model

        model.dk_min.deactivate()
        if hasattr(model, "obj"):
            model.obj.deactivate()
        model.obj = Objective(expr=model.total_budget, sense=minimize)

        if hasattr(model, "con_time"):
            model.del_component(model.con_time)
        model.con_time = Constraint(expr=model.total_time <= float(time_max))

        if hasattr(model, "con_dist"):
            model.del_component(model.con_dist)
        if dist_max is not None:
            model.con_dist = Constraint(expr=model.total_distance <= float(dist_max))

        return model

    def apply_min_time(self, budget_max, dist_max=None):
        model = self.model

        model.dk_min.deactivate()
        if hasattr(model, "obj"):
            model.obj.deactivate()
        model.obj = Objective(expr=model.total_time, sense=minimize)

        if hasattr(model, "con_budget"):
            model.del_component(model.con_budget)
        model.con_budget = Constraint(expr=model.total_budget <= float(budget_max))

        if hasattr(model, "con_dist"):
            model.del_component(model.con_dist)
        if dist_max is not None:
            model.con_dist = Constraint(expr=model.total_distance <= float(dist_max))

        return model

    # ----------------------------
    # SOLVE + EXTRACT + PLOT
    # ----------------------------
    def solve(self, SOLVER, NEOS_EMAIL, tee=False):
        os.environ["NEOS_EMAIL"] = NEOS_EMAIL

        results, ok = solve_on_neos(self.model, optimizer=SOLVER, neos_email=os.environ["NEOS_EMAIL"], tee=tee)

        term_condition = results.solver.termination_condition
        if term_condition == TerminationCondition.infeasible:
            print(f"⚠️  SOLVER STATUS: {term_condition}")
            print("🚨  Problem is INFEASIBLE. Constraints cannot be satisfied.")

            self.ok = False
            self.results = results
            return results, False

        if ok:
            try:
                self.model.solutions.load_from(results)
            except Exception as e:
                print(f"Standard load failed (ignoring): {e}")
                pass

            if hasattr(self.model, 'x'):
                for v in self.model.x.values():
                    if v.value is None:
                        v.set_value(0)

            if hasattr(self.model, 'y'):
                for v in self.model.y.values():
                    if v.value is None:
                        v.set_value(0)

            if hasattr(self.model, 'u'):
                for v in self.model.u.values():
                    if v.value is None:
                        v.set_value(0)

            if hasattr(self.model, 'z'):
                for v in self.model.z.values():
                    if v.value is None:
                        v.set_value(0)

        self.results = results
        self.ok = ok

        print(results)
        if not ok:
            print("NEOS failed:", results.solver.status, results.solver.termination_condition)
        return results, ok

    def print_metrics(self):
        model = self.model
        if hasattr(model, "obj"):
            print("Objective =", value(model.obj))
        else:
            print("Objective =", value(model.dk_min))

        print("Total distance =", value(model.total_distance), "km")
        print("Total budget   =", value(model.total_budget), "UAH")

        if hasattr(model, "location_cost"):
            print(f"  - Locations: {value(model.location_cost):.2f} UAH")
            print(f"  - Fuel:      {value(model.travel_cost):.2f} UAH")

        print("Total time     =", value(model.total_time), "minutes")

    def extract_tour(self, threshold=0.5):
        edges = selected_edges_from_model(self.model, threshold=threshold)
        tour = reconstruct_tour(edges, start=self.s_value)
        self.tour = tour
        return tour

    def plot(self, title="TSP tour"):
        coords = coords_dict(self.nodes, self.xcoord_data, self.ycoord_data)
        plot_tsp_tour(coords, self.tour, title=title)


