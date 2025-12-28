import os
from pathlib import Path

from pyomo.environ import value

from math_models.tsp_runner import KCycleTSPRunner


class KCycleTSPService:
    """
    Солвер:
    - принимает джисончик
    - запускает ранер
    - возвращает результатом дикт без принтов
    """

    def run(self, payload: dict) -> dict:

        BASE_DIR = Path(__file__).resolve().parent

        # 1) параметры (с дефолтами)
        data_source = payload.get("data_source", "excel")

        default_excel_path = BASE_DIR / "data-model" / "Data Model.xlsx"
        default_tsplib_path = BASE_DIR / "TSPLib-data" / "eil76.tsp"

        excel_path = payload.get("excel_path") or payload.get("excelPath") or str(default_excel_path)
        tsplib_path = payload.get("tsplib_path") or payload.get("tsplibPath") or str(default_tsplib_path)

        s_value = payload.get("s_value", 1)
        k_value = payload["k_value"]

        group_size = payload.get("group_size", 1)
        speed_kmph = float(payload.get("speed_kmph", 50.0))

        budget_max = float(payload.get("budget_max", 0))
        time_max = float(payload.get("time_max", 0))

        cost_scenario = payload.get("cost_scenario", "max")
        connectivity = payload.get("connectivity", "hybrid")

        solver = payload.get("solver", "cplex")
        neos_email = payload.get("neos_email") or os.getenv("NEOS_EMAIL")

        mode = payload.get("mode", "min_distance")
        dist_max = payload.get("dist_max")

        runner = KCycleTSPRunner()

        runner.load_data(
            DATA_SOURCE=data_source,
            EXCEL_PATH=excel_path,
            TSPLIB_PATH=tsplib_path,
            COST_SCENARIO=cost_scenario,
            s_value=s_value,
            k_value=k_value,
        )

        runner.build_model(
            CONNECTIVITY=connectivity,
            group_size=group_size,
            speed_kmph=speed_kmph,
        )

        if mode == "min_distance":
            runner.apply_min_distance(budget_max=budget_max, time_max=time_max)
        elif mode == "min_budget":
            runner.apply_min_budget(time_max=time_max, dist_max=dist_max)
        elif mode == "min_time":
            runner.apply_min_time(budget_max=budget_max, dist_max=dist_max)
        else:
            return {"ok": False, "error": f"Unknown mode: {mode}"}

        results, ok = runner.solve(SOLVER=solver, NEOS_EMAIL=neos_email, tee=False)

        if not ok:
            return {
                "ok": False,
                "solver_status": str(results.solver.status),
                "termination_condition": str(results.solver.termination_condition),
            }

        tour = runner.extract_tour()

        model = runner.model
        objective = float(value(model.obj if hasattr(model, "obj") else model.dk_min))

        return {
            "ok": True,
            "tour": tour,
            "metrics": {
                "objective": objective,
                "total_distance": float(value(model.total_distance)),
                "total_budget": float(value(model.total_budget)),
                "total_time": float(value(model.total_time)),
            },
            "params": {
                "mode": mode,
                "s_value": runner.s_value,
                "k_value": runner.k_value,
                "connectivity": connectivity,
                "cost_scenario": cost_scenario,
                "solver": solver,
            },
        }

