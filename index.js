/** @format */

document.addEventListener('DOMContentLoaded', () => {
  const canv = document.getElementById('canv');
  canv.width = window.innerWidth - 40;
  canv.height = window.innerHeight - 40;
  const canvWidth = canv.width;
  const canvHeight = canv.height;
  const ctx = canv.getContext('2d');
  // const canvData = ctx.getImageData(0, 0, canvWidth, canvHeight);
  // function drawPixel(x, y, r = 0, g = 0, b = 0, a = 255) {
  //   const index = (x + y * canvWidth) * 4;

  //   canvData.data[index + 0] = r;
  //   canvData.data[index + 1] = g;
  //   canvData.data[index + 2] = b;
  //   canvData.data[index + 3] = a;
  // }
  // function updateCanvas() {
  //   ctx.putImageData(canvData, 0, 0);
  // }

  function drawPoint({ x, y, type = 0, d = 4, c = [0, 0, 0, 255] }) {
    switch (type) {
      case 1:
        c = [0, 255, 0, 255];
        d = 6;
        break;
      case 2:
        c = [255, 0, 0, 255];
        d = 6;
        break;
      case 3:
        c = [0, 0, 255, 255];
        d = 4;
        break;
    }
    ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
    ctx.beginPath();
    ctx.arc(x, y, d / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  function drawLine({ x0, y0, x1, y1, type = 0, c = [0, 0, 0, 255] }) {
    switch (type) {
      case 1:
        c = [0, 255, 0, 255];
        break;
      case 2:
        c = [255, 0, 0, 255];
        break;
      case 3:
        c = [0, 0, 255, 255];
        break;
    }
    ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
  }
  // function drawText({ id, x, y, type = 0, c = [0, 0, 0, 255] }) {
  //   switch (type) {
  //     case 1:
  //       c = [0, 255, 0, 255];
  //       break;
  //     case 2:
  //       c = [255, 0, 0, 255];
  //       break;
  //     case 3:
  //       c = [0, 0, 255, 255];
  //       break;
  //   }
  //   ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
  //   ctx.font = '12px serif';
  //   ctx.fillText(id, x + 5, y);
  // }
  function generatePoints(n, width, height) {
    const points = [];
    for (let i = 0; i < n; i += 1) {
      points[i] = {
        id: i,
        x: (Math.random() * 0.9 + 0.05) * width,
        y: (Math.random() * 0.9 + 0.05) * height,
        type: 0,
      };
    }
    return points;
  }
  function getDistance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }
  function sortPoints(a, b) {
    return a[2] - b[2];
  }
  function calcSortDists(points) {
    const dists = [];
    for (let i = 0; i < points.length - 1; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        dists.push([points[i], points[j], getDistance(points[i], points[j])]);
      }
    }
    dists.sort(sortPoints);
    return dists;
  }
  function choiceStartPoint(points) {
    let start = 0;
    while (points[(start = Math.floor(Math.random() * points.length))].type == 2);
    points[start].type = 1;
    return points[start];
  }
  function choiceEndPoint(points) {
    let end = 0;
    while (points[(end = Math.floor(Math.random() * points.length))].type == 1);
    points[end].type = 2;
    return points[end];
  }
  function findMinDist(dists, a, start) {
    let i = start;
    while (i >= 0 && i < dists.length) {
      if (dists[i][0] == a || dists[i][1] == a) return i;
      i += 1;
    }
    if (i < 0 || i >= dists.length) return -1;
  }
  function compareDensity(dists, a, b) {
    if (a.id == b.id) return -1;
    if ((a.type == 1 && b.type == 2) || (a.type == 2 && b.type == 1)) return -1;
    if (a.type == 1 || a.type == 2) return b;
    if (b.type == 1 || b.type == 2) return a;
    let diff = 0;
    let pos_a = 0;
    let pos_b = 0;
    do {
      pos_a = findMinDist(dists, a, pos_a);
      pos_b = findMinDist(dists, b, pos_b);
      if (pos_a == pos_b) {
        pos_a = findMinDist(dists, a, pos_a + 1);
        pos_b = findMinDist(dists, b, pos_b + 1);
      }
      if (pos_a == -1) return a;
      if (pos_b == -1) return b;
      let diff = dists[pos_a][2] - dists[pos_b][2];
      if (diff < 0) return a;
      if (diff > 0) return b;
    } while (diff == 0);
  }
  function deletePoint(points, dists, a) {
    for (let i = 0; i < dists.length; i += 1) {
      if (dists[i][0] == a || dists[i][1] == a) {
        dists.splice(i, 1);
        i -= 1;
      }
    }
    let index;
    while (index != -1) {
      index = points.indexOf(a);
      index != -1 && points.splice(index, 1);
    }
  }
  function thinoutPoints(points, dists, m) {
    var cur_index = 0;
    while (points.length > m) {
      let delPoint = -1;
      do {
        delPoint = compareDensity(dists, dists[cur_index][0], dists[cur_index][1]);
        if (delPoint == -1) cur_index += 1;
      } while (delPoint == -1);
      deletePoint(points, dists, delPoint);
    }
  }
  function setControlPoint(point) {
    if (point.type == 0) point.type = 3;
  }
  function setControlPoints(points) {
    points.forEach(setControlPoint);
  }
  function buildRoute(dists, startPoint, endPoint) {
    let route = [];
    route.push(startPoint);

    let curPoint = startPoint;
    let nextPoint = startPoint;
    let pos = 0;
    while ((pos = findMinDist(dists, curPoint, pos)) != -1) {
      nextPoint = dists[pos][0] == curPoint ? dists[pos][1] : dists[pos][0];
      if (nextPoint != endPoint && route.indexOf(nextPoint) == -1) {
        curPoint = nextPoint;
        route.push(nextPoint);
        pos = 0;
      } else pos += 1;
    }
    route.push(endPoint);
    return route;
  }
  function displayPoints(points) {
    points.forEach(drawPoint);
    // points.forEach(drawText);
  }
  function displayRoute(route) {
    for (let i = 0; i < route.length - 1; i += 1)
      drawLine({
        x0: route[i].x,
        y0: route[i].y,
        x1: route[i + 1].x,
        y1: route[i + 1].y,
        type: 0,
      });
  }
  function displayDump() {
    console.log(origin_points);
    console.log(origin_dists);
    console.log(points);
    console.log(dists);
    console.log(route);
  }

  const n = 100;

  const origin_points = generatePoints(n, canvWidth, canvHeight);
  const origin_dists = calcSortDists(origin_points);

  const startPoint = choiceStartPoint(origin_points);
  const endPoint = choiceEndPoint(origin_points);

  let points = [...origin_points];
  let dists = [...origin_dists];

  console.log(typeof origin_points);

  thinoutPoints(points, dists, 10);
  setControlPoints(points);
  let route = buildRoute(dists, startPoint, endPoint);

  displayPoints(origin_points);
  displayRoute(route);

  displayDump();
});
