from collections.abc import Callable
from datetime import UTC, datetime
from uuid import uuid4

from cuatro_tablas.domain.catalog import Catalog
from cuatro_tablas.domain.configuration import TableConfiguration
from cuatro_tablas.domain.pricing import calculate_quote
from cuatro_tablas.domain.quote_request import Contact, QuoteRequest, QuoteRequestRepository


def submit_quote_request(
    configuration: TableConfiguration,
    contact: Contact,
    *,
    catalog: Catalog,
    repository: QuoteRequestRepository,
    now: Callable[[], datetime] = lambda: datetime.now(UTC),
    new_id: Callable[[], str] = lambda: str(uuid4()),
) -> QuoteRequest:
    """Price the configuration on the server and store the request.

    The price is always recomputed here: a total sent by the client is never
    trusted. An invalid configuration raises before anything is stored.
    """
    quote = calculate_quote(configuration, catalog)
    request = QuoteRequest(
        id=new_id(),
        created_at=now(),
        configuration=configuration,
        contact=contact,
        quote=quote,
    )
    repository.add(request)
    return request
