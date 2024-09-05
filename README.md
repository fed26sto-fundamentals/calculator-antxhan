# odin-calculator

My personal goal was to make a calculator as similar as possible to the iPhone iOS 17 calculator. Not just lookswise, but also behaviour wise. The only addition is the backspace button which was part of The Odin Project's extra credit challenge. However, you can still swipe on the display to backspace, just like on the iPhone.

## TO-DO

- [ ] fix: limit amount of characters visible on the display, like round decimals / use scienctific notation.
- [ ] feat: add spaces every 4th digit in the display. \* only do it on non-decimals. Also no spaces at all if the number includes an "e" (scientific notation)
- [ ] feat(style): responsive font-size based on digit amount.
- [ ] feat(style): hover / active effects. should also work on keyboard input.
- [ ] feat: add a footer with credits + link to instructions and tricks on how to use it.

toExponential should kick in when the number is
smaller than 0.00000001 but larger than 0
larger than 999 999 999

so -999 999 999 + -1 = -1e9
-1e9 < -999 999 999 = true

if (integer.length > MAX_DIGITS)
