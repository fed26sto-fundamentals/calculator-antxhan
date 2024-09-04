# odin-calculator

My personal goal was to make a calculator as similar as possible to the iPhone iOS 17 calculator. Not just lookswise, but also behaviour wise. The only addition is the backspace button which was part of The Odin Project's extra credit challenge.

## TO-DO

- [ ] fix: limit amount of characters visible on the display, like round decimals and use scienctific notation.
- [ ] feat: add spaces every 4th digit in the display. \* only do it on non-decimals. Also no spaces at all if the number includes an "e" (scientific notation)
- [ ] feat: swiping to the left on the display should backspace.
- [ ] feat: backspace button.
- [ ] feat: percentage button. fix so that when doing it on RIGHT, if Error and i press again nothing should happen, however if i press a digit it resets to LEFT and with the new digit. So if i did percent so many times on RIGHT that it displays error, it i press again nothing should happen. Only something should happen if i clear or press a digit. If i press digit it should reset LEFT and RIGHT.
- [x] feat: negative/positive toggle
- [x] fix: handle maximum number errors. iphone max is 1e160
- [x] fix: handle minimmum number errors. iphone min is 1e-100.
- [x] fix: when entering 5 = + = it should display 10.
- [x] fix: when entering 111 = 222 it should display 222 (overwrite the 111).
- [x] fix: when entering 555 = / 5 it displays 1, should be 111.
- [x] fix: randomly clicking operators without clicking digits and then equals displays NaN. It's a zero division error.
- [x] fix: resets the LEFT when i do 1 + 2 =, displays 3 as it should, then i press digit 5 it displays 5, then 6 it displays 6
