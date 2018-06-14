var bounce = new Bounce();
bounce.scale({
  from: { x: 0.5, y: 0.5 },
  to: { x: 1, y: 1 }
});
bounce.applyTo($(".headerToBeAnimated"));
bounce.applyTo($(".header2ToBeAnimated"));

