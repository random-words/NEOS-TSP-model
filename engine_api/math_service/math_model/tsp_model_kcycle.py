from pyomo.environ import *

from pyomo.environ import *


def create_tsp_model(nodes, s, k, xcoord_data, ycoord_data, d_data):
    nodes = list(nodes)

    # Приводимо до типів безпечно
    if nodes and isinstance(nodes[0], str):
        s_val = str(s)
    else:
        s_val = int(s)

    k_val = int(k)  # "Запікаємо" значення як звичайне число

    if s_val not in nodes:
        raise ValueError(f"Start node s={s_val} is not in nodes list.")
    if k_val > (len(nodes) - 1):
        raise ValueError(f"k={k} must be <= |nodes|-1 = {len(nodes) - 1}")

    m = ConcreteModel()

    # --- Sets ---
    m.NODES = Set(initialize=nodes, ordered=True)

    def arcs_init(m_):
        return [(i, j) for i in m_.NODES for j in m_.NODES if i != j]

    m.ARCS = Set(dimen=2, initialize=arcs_init)

    # --- Params (Тільки дані, не конфігурація) ---
    # s і k більше НЕ є Param об'єктами Pyomo, це просто змінні Python
    # m.s = Param(...) -> ВИДАЛЕНО
    # m.k = Param(...) -> ВИДАЛЕНО

    # Зберігаємо s_val в об'єкті моделі просто як атрибут (для зручності доступу ззовні)
    m.s_val_attr = s_val
    m.k_val_attr = k_val

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
    # Bounds теж використовують звичайне число k_val
    m.u = Var(m.NODES, domain=Integers, bounds=(1, k_val))

    # --- Constraints ---

    # Фіксуємо старт (hardcoded s_val)
    m.con_y_start = Constraint(expr=m.y[s_val] == 0)

    # Objective
    m.dk_min = Objective(
        expr=sum(m.d[i, j] * m.x[i, j] for (i, j) in m.ARCS),
        sense=minimize
    )

    # Base constraints
    def con2_rule(m_, i):
        outdeg = sum(m_.x[i, j] for j in m_.NODES if (i, j) in m_.ARCS)
        # Використовуємо s_val напряму
        return outdeg == (1 if i == s_val else m_.y[i])

    m.con2 = Constraint(m.NODES, rule=con2_rule)

    def con3_rule(m_, i):
        indeg = sum(m_.x[j, i] for j in m_.NODES if (j, i) in m_.ARCS)
        return indeg == (1 if i == s_val else m_.y[i])

    m.con3 = Constraint(m.NODES, rule=con3_rule)

    # con4: sum(y) == k (ВИКОРИСТОВУЄМО число k_val)
    m.con4 = Constraint(expr=sum(m.y[i] for i in m.NODES if i != s_val) == k_val)

    # --- Flow constraints ---
    # Всюди замінили m.k на k_val
    m.con5 = Constraint(m.ARCS, rule=lambda m_, i, j: m_.z[i, j] - k_val * m_.x[i, j] <= 0)
    m.con6_1 = Constraint(expr=sum(m.z[s_val, j] for j in m.NODES if (s_val, j) in m.ARCS) == k_val)
    m.con6_2 = Constraint(expr=sum(m.z[j, s_val] for j in m.NODES if (j, s_val) in m.ARCS) == 0)

    def con7_rule(m_, i):
        if i == s_val:
            return Constraint.Skip
        outgoing = sum(m_.z[i, j] for j in m_.NODES if (i, j) in m_.ARCS)
        incoming = sum(m_.z[j, i] for j in m_.NODES if (j, i) in m_.ARCS)
        return outgoing - incoming == -m_.y[i]

    m.con7 = Constraint(m.NODES, rule=con7_rule)

    # --- MTZ ---
    def con15_rule(m_, i, j):
        if i == s_val or j == s_val:
            return Constraint.Skip
        # Тут теж k_val
        return m_.u[i] - m_.u[j] + k_val * m_.x[i, j] <= k_val - 1

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


def attach_budget(m, cost_per_person, group_size=1, fuel_consumption_l_100km=0, fuel_price_uah_l=0):
    """
    Оновлена логіка бюджету:
    Total Budget = (Витрати на місцях * Group Size) + (Витрати на паливо)

    fuel_consumption_l_100km: витрати авто (літрів на 100 км)
    fuel_price_uah_l: ціна палива (грн за літр)
    """
    # s_val = value(m.s)
    s_val = m.s_val_attr

    m.group_size = Param(initialize=int(group_size), mutable=True, within=PositiveIntegers)

    m.cost_pp = Param(
        m.NODES,
        initialize=lambda m_, i: float(cost_per_person.get(i, 0.0)),
        within=NonNegativeReals,
        mutable=True
    )

    # Вартість 1 км шляху = (літри на 100 км / 100) * ціна літра
    cost_per_km = (float(fuel_consumption_l_100km) / 100.0) * float(fuel_price_uah_l)
    m.fuel_cost_per_km = Param(initialize=cost_per_km, mutable=True, within=NonNegativeReals)

    m.location_cost = Expression(
        expr=m.group_size * sum(m.cost_pp[i] * m.y[i] for i in m.NODES if i != s_val)
    )

    # Total Distance * Cost per km
    m.travel_cost = Expression(
        expr=sum(m.d[i, j] * m.x[i, j] for (i, j) in m.ARCS) * m.fuel_cost_per_km
    )

    m.total_budget = Expression(
        expr=m.location_cost + m.travel_cost
    )

    return m.total_budget


def attach_time(m, route_pace, speed_kmph=40.0):
    """
    Stay Time = (кількість активних точок) * route_pace
    Оскільки ми маємо обмеження con4 (сума y = k), то сумарний час зупинок
    буде рівно k * route_pace.

    Але ми прив'язуємо це до змінних y[i], щоб солвер "відчував" вагу кожної точки.
    """
    s_val = m.s_val_attr
    speed = float(speed_kmph)

    m.route_pace = Param(initialize=float(route_pace), mutable=True, within=NonNegativeReals)

    m.travel_time = Expression(
        expr=sum((60.0 * m.d[i, j] / speed) * m.x[i, j] for (i, j) in m.ARCS)
    )

    m.stay_time = Expression(
        expr=sum(m.route_pace * m.y[i] for i in m.NODES if i != s_val)
    )

    m.total_time = Expression(
        expr=m.travel_time + m.stay_time
    )
    return m.total_time
