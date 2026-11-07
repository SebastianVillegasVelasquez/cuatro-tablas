import pytest

from cuatro_tablas.domain.quote_request import Contact, InvalidContact


def test_contact_with_email_is_valid():
    assert Contact(name="Ana", email="ana@example.com").email == "ana@example.com"


def test_contact_with_phone_is_valid():
    assert Contact(name="Ana", phone="3001234567").phone == "3001234567"


def test_name_is_required():
    with pytest.raises(InvalidContact):
        Contact(name="   ", email="ana@example.com")


def test_a_way_to_reach_the_customer_is_required():
    with pytest.raises(InvalidContact):
        Contact(name="Ana")


def test_blank_email_and_phone_do_not_count():
    with pytest.raises(InvalidContact):
        Contact(name="Ana", email=" ", phone="")
