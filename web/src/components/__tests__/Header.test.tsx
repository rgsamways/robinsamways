import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Header from "../Header";

describe("Header — photo position (D7)", () => {
  test("the photo renders after the contact-info block in the DOM", () => {
    render(<Header />);

    const contactInfo = screen.getByText(/Maynooth, ON/);
    const photo = screen.getByAltText("Robin Samways");

    // Node.DOCUMENT_POSITION_FOLLOWING (4): set on the result when `photo`
    // comes after `contactInfo` in document order — restores
    // resume-homepage's already-shipped "top-right" layout requirement.
    const position = contactInfo.compareDocumentPosition(photo);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
