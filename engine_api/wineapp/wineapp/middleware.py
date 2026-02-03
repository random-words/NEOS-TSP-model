import os
import json
import time
import uuid
import logging
from datetime import datetime, timezone

logger = logging.getLogger("api.audit")


def _utc_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _safe_json_loads(raw: bytes):
    if not raw:
        return None
    try:
        return json.loads(raw.decode("utf-8"))
    except Exception:
        return {"_raw": raw[:2000].decode("utf-8", errors="replace"), "_truncated": len(raw) > 2000}


def _json_safe(obj):
    """
    Гарантирует, что obj можно положить в JSON (Decimal/UUID/etc -> str).
    """
    if obj is None:
        return None
    try:
        json.dumps(obj, ensure_ascii=False)
        return obj
    except TypeError:
        return json.loads(json.dumps(obj, ensure_ascii=False, default=str))


def _get_client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def _mask_email(email: str | None):
    if not email or "@" not in email:
        return email
    name, domain = email.split("@", 1)
    if len(name) <= 3:
        return f"{name[0]}***@{domain}"
    return f"{name[:3]}***@{domain}"


def _compact_request(req: dict | None):
    """В лог — только важное, без огромных allNodes."""
    if not isinstance(req, dict):
        return None

    all_nodes = req.get("allNodes") or []
    start = req.get("startNode") or {}

    return {
        "numberOfNodes": req.get("numberOfNodes"),
        "groupSize": req.get("groupSize"),
        "budgetMax": req.get("budgetMax"),
        "timeMax": req.get("timeMax"),
        "distanceMax": req.get("distanceMax"),
        "routePace": req.get("routePace"),
        "objectiveFunction": req.get("objectiveFunction"),
        "startNodeId": start.get("id"),
        "allNodesCount": len(all_nodes) if isinstance(all_nodes, list) else None,
        "neosEmail_masked": _mask_email(req.get("neosEmail")),
    }


def _compact_response(resp: dict | None):
    if not isinstance(resp, dict):
        return None

    tour = resp.get("tour") or []
    tour_ids = []
    if isinstance(tour, list):
        for x in tour:
            if isinstance(x, dict) and "id" in x:
                tour_ids.append(str(x["id"]))

    return {
        "resCode": resp.get("resCode"),
        "resMessage": resp.get("resMessage"),
        "objective": resp.get("objective"),
        "totalDistance": resp.get("totalDistance"),
        "totalBudget": resp.get("totalBudget"),
        "totalTime": resp.get("totalTime"),
        "tourIds": tour_ids[:200],
    }


def _extract_response_payload(response):
    """
    DRF: используем response.data (самый надежный путь)
    Django JsonResponse: response.content
    """
    if response is None:
        return None

    # streaming лучше не трогать
    if getattr(response, "streaming", False):
        return {"_streaming": True}

    # 1) DRF Response
    if hasattr(response, "data"):
        try:
            return _json_safe(response.data)
        except Exception:
            pass

    # 2) Fallback: пробуем content (не зависим от Content-Type)
    raw = getattr(response, "content", b"")
    if not raw:
        return None

    # если это JSON — распарсим; если нет — сохраним как текст (обрезано)
    parsed = _safe_json_loads(raw)
    if parsed is not None:
        return parsed

    try:
        text = raw[:2000].decode("utf-8", errors="replace")
    except Exception:
        text = str(raw[:2000])
    return {"_raw_text": text, "_truncated": len(raw) > 2000}


class JsonAuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.log_full = os.getenv("LOG_FULL_PAYLOAD", "0") == "1"

    def __call__(self, request):
        start_ts = time.perf_counter()
        started_at = _utc_iso()

        request_id = request.headers.get("X-Request-Id") or str(uuid.uuid4())
        request.request_id = request_id

        req_payload = None
        if request.method in ("POST", "PUT", "PATCH"):
            req_payload = _safe_json_loads(getattr(request, "body", b""))

        response = None
        err = None

        try:
            response = self.get_response(request)

            # DRF Response иногда лениво рендерится — попросим отрендерить
            try:
                is_streaming = getattr(response, "streaming", False)
                is_rendered = getattr(response, "is_rendered", True)
                if response and (not is_streaming) and hasattr(response, "render") and callable(response.render) and not is_rendered:
                    response.render()
            except Exception:
                pass

            return response

        except Exception as e:
            err = e
            raise

        finally:
            finished_at = _utc_iso()
            duration_ms = int((time.perf_counter() - start_ts) * 1000)

            status_code = getattr(response, "status_code", 500)

            resp_payload = _extract_response_payload(response)

            req_meta = _compact_request(req_payload)
            resp_meta = _compact_response(resp_payload if isinstance(resp_payload, dict) else None)

            log_record = {
                "ts": finished_at,
                "level": "INFO" if err is None and status_code < 500 else "ERROR",
                "service": "wineapp-optimizer",
                "env": os.getenv("APP_ENV", "local"),
                "request_id": request_id,
                "http": {
                    "method": request.method,
                    "path": request.path,
                    "query": request.META.get("QUERY_STRING", ""),
                    "status_code": status_code,
                    "client_ip": _get_client_ip(request),
                    "user_agent": request.META.get("HTTP_USER_AGENT", ""),
                },
                "timing": {
                    "started_at": started_at,
                    "finished_at": finished_at,
                    "duration_ms": duration_ms,
                },
                "payload": {
                    "request_meta": req_meta,
                    "response_meta": resp_meta,
                    "request": req_payload if self.log_full else None,
                    "response": resp_payload if self.log_full else None,
                },
                "error": None if err is None else {
                    "type": err.__class__.__name__,
                    "message": str(err),
                },
            }

            logger.info(log_record)
