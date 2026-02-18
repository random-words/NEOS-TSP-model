import requests


def get_osrm_matrices(nodes, xcoord, ycoord, service_url="http://router.project-osrm.org"):
    """
    Отримує матриці відстаней та часу від OSRM.

    Args:
        nodes: список ID точок
        xcoord: словник {id: lon} (x = Довгота)
        ycoord: словник {id: lat} (y = Широта)
        service_url: URL OSRM сервера
    """

    # 1. Формуємо координати для URL
    # OSRM вимагає формат: {lon},{lat};{lon},{lat}
    # Тобто у нас це: {x},{y}

    coords_list = []
    node_order = list(nodes)

    for i in node_order:
        lon = xcoord[i]  # x
        lat = ycoord[i]  # y
        coords_list.append(f"{lon},{lat}")

    coords_str = ";".join(coords_list)

    # 2. Запит до API
    # annotations=duration,distance (і час, і відстань)
    # skip_waypoints=true (пришвидшує запит, не шукає найближчу дорогу для кожної точки)
    url = f"{service_url}/table/v1/driving/{coords_str}?annotations=duration,distance"

    print(f"🌍 OSRM Request ({len(node_order)} pts): {url[:50]}...")

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"❌ OSRM Connection Failed: {e}")
        return None, None

    if data.get("code") != "Ok":
        print(f"❌ OSRM Error: {data.get('code')} - {data.get('message')}")
        return None, None

    # 3. Розбір відповіді
    osrm_durations = data["durations"]  # секунди
    osrm_distances = data["distances"]  # метри

    dist_matrix = {}
    time_matrix = {}

    num_nodes = len(node_order)

    for i in range(num_nodes):
        for j in range(num_nodes):
            u = node_order[i]
            v = node_order[j]

            # Конвертація
            dist_km = osrm_distances[i][j] / 1000.0  # метри -> км
            time_min = osrm_durations[i][j] / 60.0  # сек -> хв

            # Фікс діагоналі (сам до себе = 0)
            if i == j:
                dist_km = 0.0
                time_min = 0.0

            dist_matrix[(u, v)] = round(dist_km, 3)
            time_matrix[(u, v)] = round(time_min, 2)

    print("✅ OSRM data received.")
    return dist_matrix, time_matrix