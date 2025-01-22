from typing import Any


class ServerSentEvent:
    data: str
    event: str | None = None
    id: str | None = None
    retry: str | None = None

    def __init__(
        self,
        data: Any,
        event: str | None = None,
        id: str | None = None,
        retry: str | None = None,
    ) -> None:
        self.data = data
        self.event = event
        self.id = id
        self.retry = retry

    def encode(self) -> bytes:
        message = f"data: {self.data}"
        if self.event is not None:
            message = f"{message}\nevent: {self.event}"
        if self.id is not None:
            message = f"{message}\nid: {self.id}"
        if self.retry is not None:
            message = f"{message}\nretry: {self.retry}"
        message = f"{message}\r\n\r\n"
        # print(message)
        return message.encode("utf-8")
