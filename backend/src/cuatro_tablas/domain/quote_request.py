"""A customer's quote request: configuration, contact data and the price quoted."""

from dataclasses import dataclass
from datetime import datetime
from typing import Protocol

from cuatro_tablas.domain.configuration import TableConfiguration
from cuatro_tablas.domain.pricing import Quote


class InvalidContact(Exception):
    """The contact data cannot be used to reach the customer."""


@dataclass(frozen=True)
class Contact:
    name: str
    email: str | None = None
    phone: str | None = None
    message: str | None = None

    def __post_init__(self) -> None:
        if not self.name.strip():
            raise InvalidContact("A name is required.")
        has_email = bool(self.email and self.email.strip())
        has_phone = bool(self.phone and self.phone.strip())
        if not (has_email or has_phone):
            raise InvalidContact("An email or a phone number is required.")


@dataclass(frozen=True)
class QuoteRequest:
    id: str
    created_at: datetime
    configuration: TableConfiguration
    contact: Contact
    quote: Quote


class QuoteRequestRepository(Protocol):
    """Port: how the domain stores and reads quote requests."""

    def add(self, request: QuoteRequest) -> None: ...

    def list_all(self) -> list[QuoteRequest]:
        """Every request, newest first."""
        ...
