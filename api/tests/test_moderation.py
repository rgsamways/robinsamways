from app.moderation import contains_blocked_word


def test_rejects_a_standalone_blocked_word():
    assert contains_blocked_word("what a bullshit application") is True


def test_rejects_a_blocked_word_regardless_of_case():
    assert contains_blocked_word("total BULLSHIT") is True


def test_allows_innocuous_text_with_no_blocked_words():
    assert contains_blocked_word("Alice Anderson") is False


def test_does_not_flag_a_blocked_substring_inside_a_longer_innocuous_word():
    # The Scunthorpe problem: "Scunthorpe" contains "cunt", "Essex" contains
    # "sex" -- neither should be rejected, since the match is on word
    # boundaries, not a bare substring check.
    assert contains_blocked_word("Scunthorpe") is False
    assert contains_blocked_word("Essex") is False
    assert contains_blocked_word("Classic Homes Ltd") is False  # contains "ass"


def test_still_flags_the_blocked_word_alongside_a_longer_innocuous_one():
    assert contains_blocked_word("Essex ass") is True
