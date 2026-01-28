from pyomo.environ import *


def create_tsp_model(nodes, s, k, xcoord_data, ycoord_data, d_data):
    """
    k-cycle модель (всі блоки присутні: base + flow + MTZ).
    NODES = реальні node ids (Set), а не RangeSet.

    Базові (загальні) обмеження для всіх постановок:
      - con2 (вихід)
      - con3 (вхід)
      - con4 (рівно k вершин крім s)

    Зв'язність:
      - flow: con5, con6_1, con6_2, con7
      - MTZ : con15
      - hybrid: всі разом
    """
    nodes = list(nodes)
    s_val = int(s)

    if s_val not in nodes:
        raise ValueError(f"Start node s={s_val} is not in nodes list.")
    if int(k) > (len(nodes) - 1):
        raise ValueError(f"k={k} must be <= |nodes|-1 = {len(nodes)-1}")

    m = ConcreteModel()

    # --- Sets ---
    m.NODES = Set(initialize=nodes, ordered=True)

    def arcs_init(m_):
        return [(i, j) for i in m_.NODES for j in m_.NODES if i != j]
    m.ARCS = Set(dimen=2, initialize=arcs_init)

    # --- Params ---
    m.s = Param(initialize=s_val)
    m.k = Param(initialize=int(k), within=PositiveIntegers)

    m.x_coord = Param(m.NODES, initialize=lambda m_, i: float(xcoord_data[i]))
    m.y_coord = Param(m.NODES, initialize=lambda m_, i: float(ycoord_data[i]))

    m.d = Param(
        m.ARCS,
        within=NonNegativeReals,
        initialize=lambda m_, i, j: float(d_data[(i, j)])
    )

    # --- Vars ---
    m.x = Var(m.ARCS, domain=Binary)
    m.y = Var(m.NODES, domain=Binary)
    m.z = Var(m.ARCS, domain=NonNegativeReals)
    m.u = Var(m.NODES, domain=Integers, bounds=lambda m_, i: (1, m_.k))

    # y[s] не використовується у con2/con3, тому фіксуємо (важливо для budget/time)
    m.con_y_start = Constraint(expr=m.y[s_val] == 0)

    # --- Default Objective: distance ---
    m.dk_min = Objective(
        expr=sum(m.d[i, j] * m.x[i, j] for (i, j) in m.ARCS),
        sense=minimize
    )

    # --- Base constraints: con2, con3, con4 ---
    def con2_rule(m_, i):
        outdeg = sum(m_.x[i, j] for j in m_.NODES if (i, j) in m_.ARCS)
        return outdeg == (1 if i == s_val else m_.y[i])
    m.con2 = Constraint(m.NODES, rule=con2_rule)

    def con3_rule(m_, i):
        indeg = sum(m_.x[j, i] for j in m_.NODES if (j, i) in m_.ARCS)
        return indeg == (1 if i == s_val else m_.y[i])
    m.con3 = Constraint(m.NODES, rule=con3_rule)

    m.con4 = Constraint(expr=sum(m.y[i] for i in m.NODES if i != s_val) == m.k)

    # --- Flow constraints (con5 - con7) ---
    m.con5 = Constraint(m.ARCS, rule=lambda m_, i, j: m_.z[i, j] - m_.k * m_.x[i, j] <= 0)
    m.con6_1 = Constraint(expr=sum(m.z[s_val, j] for j in m.NODES if (s_val, j) in m.ARCS) == m.k)
    m.con6_2 = Constraint(expr=sum(m.z[j, s_val] for j in m.NODES if (j, s_val) in m.ARCS) == 0)

    def con7_rule(m_, i):
        if i == s_val:
            return Constraint.Skip
        outgoing = sum(m_.z[i, j] for j in m_.NODES if (i, j) in m_.ARCS)
        incoming = sum(m_.z[j, i] for j in m_.NODES if (j, i) in m_.ARCS)
        return outgoing - incoming == -m_.y[i]
    m.con7 = Constraint(m.NODES, rule=con7_rule)

    # --- MTZ (con15) ---
    def con15_rule(m_, i, j):
        if i == s_val or j == s_val:
            return Constraint.Skip
        return m_.u[i] - m_.u[j] + m_.k * m_.x[i, j] <= m_.k - 1
    m.con15 = Constraint(m.ARCS, rule=con15_rule)

    return m


def set_connectivity(m, mode="hybrid"):
    """
    mode: "flow" | "mtz" | "hybrid"
    """
    mode = str(mode).lower().strip()

    if mode == "flow":
        m.con5.activate()
        m.con6_1.activate()
        m.con6_2.activate()
        m.con7.activate()

        m.con15.deactivate()
    elif mode == "mtz":
        m.con5.deactivate()
        m.con6_1.deactivate()
        m.con6_2.deactivate()
        m.con7.deactivate()

        m.con15.activate()
    elif mode == "hybrid":
        m.con5.activate()
        m.con6_1.activate()
        m.con6_2.activate()
        m.con7.activate()
        m.con15.activate()
    else:
        raise ValueError("mode must be one of: flow, mtz, hybrid")


def attach_total_distance(m):
    if not hasattr(m, "total_distance"):
        m.total_distance = Expression(expr=sum(m.d[i, j] * m.x[i, j] for (i, j) in m.ARCS))
    return m.total_distance


def attach_budget(m, cost_per_person, group_size=1):
    """
    total_budget = group_size * sum_{i != s} cost[i] * y[i]
    cost_per_person: dict {node: cost} (на 1 людину)
    """
    s_val = value(m.s)

    m.group_size = Param(initialize=int(group_size), mutable=True, within=PositiveIntegers)

    m.cost_pp = Param(
        m.NODES,
        initialize=lambda m_, i: float(cost_per_person.get(i, 0.0)),
        within=NonNegativeReals,
        mutable=True
    )

    m.total_budget = Expression(
        expr=m.group_size * sum(m.cost_pp[i] * m.y[i] for i in m.NODES if i != s_val)
    )
    return m.total_budget


def attach_time(m, stay_minutes, speed_kmph=40.0):
    """
    travel_time (minutes) = sum_{(i,j)} 60 * d[i,j]/speed * x[i,j]
    total_time = travel_time + sum_{i != s} stay[i] * y[i]
    stay_minutes: dict {node: minutes}
    """
    s_val = value(m.s)
    speed = float(speed_kmph)

    m.stay_min = Param(
        m.NODES,
        initialize=lambda m_, i: float(stay_minutes.get(i, 0.0)),
        within=NonNegativeReals,
        mutable=True
    )

    m.travel_time = Expression(
        expr=sum((60.0 * m.d[i, j] / speed) * m.x[i, j] for (i, j) in m.ARCS)
    )

    m.total_time = Expression(
        expr=m.travel_time + sum(m.stay_min[i] * m.y[i] for i in m.NODES if i != s_val)
    )
    return m.total_time
