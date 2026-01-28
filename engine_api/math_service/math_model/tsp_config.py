# ----------------------------
# CONFIG: data source
# ----------------------------
DATA_SOURCE = "excel"   # "excel" або "tsplib"

EXCEL_PATH = "../data-model/Data Model.xlsx"
TSPLIB_PATH = "TSPLib-data/eil76.tsp"

NEOS_EMAIL = "antonsivko480@gmail.com"

# ----------------------------
# CONFIG: TSP / k-cycle
# ----------------------------
s_value = 1
k_value = 8

# ----------------------------
# CONFIG: travel/time/budget parameters
# ----------------------------
group_size = 2
speed_kmph = 50.0
budget_max = 100000
time_max   = 100 * 60.0
dist_max = None # If Needed

COST_SCENARIO = "max"   # "min" | "avg" | "max"
CONNECTIVITY = "hybrid" # "flow" | "mtz" | "hybrid"

SOLVER = "cplex"        # NEOS solver name
