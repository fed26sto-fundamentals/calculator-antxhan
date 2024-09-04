# odin-calculator

My personal goal was to make a calculator as similar as possible to the iPhone iOS 17 calculator. Not just lookswise, but also behaviour wise. The only addition is the backspace button which was part of The Odin Project's extra credit challenge.

## TO-DO

- [ ] feat: add spaces every 4th digit in the display. \* only do it on non-decimals. Also no spaces if the number includes an "e" (scientific notation)
- [ ] feat: swiping to the left on the display should backspace.
- [x] feat: negative/positive toggle
- [x] fix: handle maximum number errors. iphone max is 1e160
- [ ] fix: handle minimmum number errors. iphone min is 1e-100.
- [x] fix: when entering 5 = + = it should display 10.
- [x] fix: when entering 111 = 222 it should display 222 (overwrite the 111).
- [x] fix: when entering 555 = / 5 it displays 1, should be 111.
- [x] fix: randomly clicking operators without clicking digits and then equals displays NaN. It's a zero division error.
- [x] fix: resets the LEFT when i do 1 + 2 =, displays 3 as it should, then i press digit 5 it displays 5, then 6 it displays 6
