

## box-shadow

```css
.CLASS_NAME {
  /* This defines a size of a pixel, and origin */
  width: 10px;
  height: 10px;
  /* If wanna set pixel at origin */
  background: black;

  box-shadow:
    /* Pixel right of origin */
    10px 0px red,
    /* Pixel below origin*/
    0px 10px blue,
    /* Right bottom of origin */
    10px 10px yellow
    /* x y color*/
}
```

## Animation

`@keyframes` defines how the CSS styles will change during animation.

```css
@keyframes ANIMATION_NAME {
  0% {
    CSS_PROPERTY: CSS_VALUE;
  }
  50% {
    CSS_PROPERTY: CSS_VALUE;
  }
}
```

```css
animation-name: NAME;
animation-duration: Xs;
animation-iteration-count: infinite;
```

```css
animation: NAME Xs infinite;
```

## Combine box-shadow and Animation

```css
.pixelart {
  animation: animated-art 1s infinite;
}

@keyframes animated-art {
  0%,
  50% {
    box-shadow:
    /* 1st frame of pixel art */
    ;
    /* origin */
    height: 10px;
    width: 10px;
  }
  50.1%,
  100% {
    box-shadow:
    /* 2nd frame of pixel art */
    ;
    height: 10px;
    width: 10px;
  }
}
```

## Value

Skin: #fedcbd

## Pixel Drawing Tool

- [Pixel Art to CSS](https://www.pixelartcss.com/)
- [Canvas box-shadow pixel art generator | CodePen](https://codepen.io/ludviglindblom/pen/DqErwW)



## Reference

- [Fun Times With CSS Pixel Art](https://css-tricks.com/fun-times-css-pixel-art/)