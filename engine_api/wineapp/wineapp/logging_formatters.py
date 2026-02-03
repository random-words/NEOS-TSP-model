import json
import logging

class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        msg = record.msg
        if isinstance(msg, dict):
            payload = msg
        else:
            payload = {"message": str(msg)}

        payload.setdefault("logger", record.name)
        payload.setdefault("py_level", record.levelname)
        return json.dumps(payload, ensure_ascii=False)
