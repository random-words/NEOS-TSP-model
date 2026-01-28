import os
import math
import pandas as pd
import tsplib95
import matplotlib.pyplot as plt

from pyomo.environ import value
from pyomo.opt import SolverManagerFactory, SolverStatus, TerminationCondition

# ----------------------------
# Visualization
# ----------------------------
def plot_tsp_tour(coords, tour, title=None, show_positions=True):
    """
    coords: dict {node: (x, y)}
    tour: список вершин у порядку обходу, наприклад [1, 23, 38, ..., 1]
          якщо останній елемент не дорівнює першому, ми автоматично замкнемо тур
    show_positions: якщо True — підписуємо вершини як "node (step)"
    """
    if not tour:
        raise ValueError("tour is empty")

    if tour[0] != tour[-1]:
        tour = list(tour) + [tour[0]]

    start = tour[0]
    position_in_tour = {node: idx for idx, node in enumerate(tour[:-1])}

    if not isinstance(coords, dict):
        coords = {i: (coords[i][0], coords[i][1]) for i in range(len(coords))}

    plt.figure(figsize=(10, 10))

    for k in range(len(tour) - 1):
        i = tour[k]
        j = tour[k + 1]
        x_i, y_i = coords[i]
        x_j, y_j = coords[j]

        dx = x_j - x_i
        dy = y_j - y_i

        plt.arrow(
            x_i, y_i, dx, dy,
            length_includes_head=True,
            head_width=1, head_length=1.75,
            linewidth=1.0, alpha=0.8, zorder=1
        )

    xs = [coords[i][0] for i in coords]
    ys = [coords[i][1] for i in coords]
    plt.scatter(xs, ys, s=30, color="blue", zorder=2, label="Other Nodes")

    x_s, y_s = coords[start]
    plt.scatter([x_s], [y_s], s=120, color="red", edgecolors="black", zorder=3, label="Start Node")

    for node, (x, y) in coords.items():
        if show_positions and node in position_in_tour:
            step = position_in_tour[node]
            text = f"{node} ({step})"
        else:
            text = str(node)
        plt.text(x, y, text, fontsize=10, ha="right", va="bottom")

    plt.title(title if title else "TSP Tour")
    plt.xlabel("X")
    plt.ylabel("Y")
    plt.gca().set_aspect("equal", adjustable="box")
    plt.grid(True, linestyle="--", alpha=0.3)
    plt.legend(loc="best")
    plt.tight_layout()
    plt.show()


# ----------------------------
# Geo -> Euclid (equirectangular)
# ----------------------------
def geo_to_euclid(lat_deg, lon_deg, lat0_deg, lon0_deg, R=6371.0, base_lat_deg=None):
    """
    x = R (λ - λ0) cos(φ1)
    y = R (φ - φ0)
    де φ, λ в радіанах. R за замовчуванням у км.
    """
    if base_lat_deg is None:
        base_lat_deg = lat0_deg

    lat = math.radians(float(lat_deg))
    lon = math.radians(float(lon_deg))
    lat0 = math.radians(float(lat0_deg))
    lon0 = math.radians(float(lon0_deg))
    base_lat = math.radians(float(base_lat_deg))

    x = R * (lon - lon0) * math.cos(base_lat)
    y = R * (lat - lat0)
    return x, y

# To Convert Lists
def geo_list_to_euclid(lat_list, lon_list, R=6371.0):
    """
    Приймає списки широт і довгот (у градусах) однакової довжини.
    Повертає два списки xcoord_list, ycoord_list у тих же одиницях, що й R.
    За нульову точку (0,0) беремо першу вершину.
    """
    assert len(lat_list) == len(lon_list), "lat_list і lon_list мають бути однакової довжини"

    # беремо першу точку як (lat0, lon0) і базову широту φ1 = lat0
    lat0_deg = lat_list[0]
    lon0_deg = lon_list[0]

    xcoord_list = []
    ycoord_list = []

    for lat_deg, lon_deg in zip(lat_list, lon_list):
        x, y = geo_to_euclid(
            lat_deg, lon_deg,
            lat0_deg=lat0_deg,
            lon0_deg=lon0_deg,
            R=R,
            base_lat_deg=lat0_deg # φ1 = φ0
        )
        xcoord_list.append(x)
        ycoord_list.append(y)

    return xcoord_list, ycoord_list


# To Convert Dataframes
def load_geo_dataframe(df, id_col="id", lat_col="lat", lon_col="lon", R=6371.0):
    """
    df -> (nodes, xcoord_data, ycoord_data)
    xcoord_data/ycoord_data: dict {node_id: x/y}
    """
    df2 = df[[id_col, lat_col, lon_col]].copy()

    df2[id_col] = pd.to_numeric(df2[id_col], errors="coerce")
    df2[lat_col] = pd.to_numeric(df2[lat_col], errors="coerce")
    df2[lon_col] = pd.to_numeric(df2[lon_col], errors="coerce")

    df2 = df2.dropna(subset=[id_col, lat_col, lon_col])

    # id як int
    df2[id_col] = df2[id_col].astype(int)

    # стабільний порядок
    df2 = df2.sort_values(id_col).reset_index(drop=True)

    ids = df2[id_col].tolist()
    lat_list = df2[lat_col].tolist()
    lon_list = df2[lon_col].tolist()

    if len(ids) == 0:
        raise ValueError("No valid rows after cleaning (id/lat/lon).")

    lat0_deg = lat_list[0]
    lon0_deg = lon_list[0]

    x_data, y_data = {}, {}
    for node_id, lat_deg, lon_deg in zip(ids, lat_list, lon_list):
        x, y = geo_to_euclid(lat_deg, lon_deg, lat0_deg, lon0_deg, R=R, base_lat_deg=lat0_deg)
        x_data[int(node_id)] = float(x)
        y_data[int(node_id)] = float(y)

    nodes = sorted(x_data.keys())
    return nodes, x_data, y_data


# ----------------------------
# TSPLIB loader
# ----------------------------
def load_tsplib_data(filename):
    """
    filename (.tsp) -> (nodes, xcoord_data, ycoord_data)
    """
    problem = tsplib95.load(filename)
    node_coords = problem.node_coords

    x_data, y_data = {}, {}
    for node_id, coords in node_coords.items():
        x_data[int(node_id)] = float(coords[0])
        y_data[int(node_id)] = float(coords[1])

    nodes = sorted(x_data.keys())
    return nodes, x_data, y_data


# ----------------------------
# Distances
# ----------------------------
def build_distance_matrix(nodes, xcoord, ycoord, rounding=2):
    """
    Повертає dict d[(i,j)] для всіх i!=j у nodes.
    rounding:
      - None -> без округлення
      - 2 -> round(dist, 2)
    """
    d = {}
    nodes = list(nodes)

    for i in nodes:
        for j in nodes:
            if i == j:
                continue
            dx = xcoord[i] - xcoord[j]
            dy = ycoord[i] - ycoord[j]
            dist = math.hypot(dx, dy)
            d[(i, j)] = round(dist, rounding) if rounding is not None else float(dist)

    return d


def coords_dict(nodes, xcoord, ycoord):
    return {i: (xcoord[i], ycoord[i]) for i in nodes}


# ----------------------------
# Solution extraction
# ----------------------------
def selected_edges_from_model(model, threshold=0.5):
    edges = []
    for (i, j) in model.ARCS:
        xv = value(model.x[i, j], exception=False)
        if xv is not None and xv >= threshold:
            edges.append((i, j))
    return edges


def reconstruct_tour(selected_edges, start, max_steps=None):
    """
    selected_edges: list[(i,j)] (має бути по суті successor mapping)
    start: стартова вершина
    """
    succ = {i: j for (i, j) in selected_edges}

    tour = [start]
    cur = start

    if max_steps is None:
        max_steps = len(succ) + 2

    for _ in range(max_steps):
        if cur not in succ:
            break
        nxt = succ[cur]
        tour.append(nxt)
        if nxt == start:
            break
        cur = nxt

    return tour


# ----------------------------
# NEOS solving
# ----------------------------
def solve_on_neos(model, optimizer="cplex", neos_email=None, tee=False):
    """
    Повертає (results, ok_bool)
    """
    if neos_email:
        os.environ["NEOS_EMAIL"] = neos_email

    neos = SolverManagerFactory("neos")
    results = neos.solve(model, opt=optimizer, tee=tee, format='nl')

    ok = (
        results.solver.status == SolverStatus.ok
        and results.solver.termination_condition in (TerminationCondition.optimal, TerminationCondition.feasible)
    )
    return results, ok
