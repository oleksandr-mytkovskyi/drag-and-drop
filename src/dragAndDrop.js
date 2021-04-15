import { interval, fromEvent, combineLatest } from 'rxjs'
import { map, filter, tap, take, takeLast, takeWhile, scan, reduce, switchMap, mergeMap, takeUntil } from 'rxjs/operators'

  const target = document.querySelector('.box');
  const target1 = document.querySelector('.box1');
  const target2 = document.querySelector('.box2');


  const mouseup = fromEvent(target, 'mouseup');
  const mousedown = fromEvent(target, 'mousedown');
  const mousemove = fromEvent(document, 'mousemove');
  const mouseup1 = fromEvent(target1, 'mouseup');
  const mousedown1 = fromEvent(target1, 'mousedown');
  const clickBox2 = fromEvent(target2, 'click');


  const a = mousedown.pipe(
    mergeMap((md) => {
      const startX = md.clientX + window.scrollX,
        startY = md.clientY + window.scrollY,
        startLeft = parseInt(md.target.style.left, 10) || 0,
        startTop = parseInt(md.target.style.top, 10) || 0;
        return mousemove.pipe(
        map((mm) => {
            return {
              left: startLeft + mm.clientX - startX,
              top: startTop + mm.clientY - startY,
              posRectangle: target.getBoundingClientRect()
            }
          }),
          takeUntil(mouseup)
          ) 
    }),
   
  )

  a.subscribe((x) => {
    console.log('mousemove: ', x);
    target.style.top = x.top + 'px';
    target.style.left = x.left + 'px';
  })

  const b = mousedown1.pipe(
    mergeMap((md) => {
      const startX = md.clientX + window.scrollX,
        startY = md.clientY + window.scrollY,
        startLeft = parseInt(md.target.style.left, 10) || 800,
        startTop = parseInt(md.target.style.top, 10) || 0;
      return mousemove.pipe(
        map((mm) => {
          return {
            left: startLeft + mm.clientX - startX,
            top: startTop + mm.clientY - startY,
            posRectangle: target1.getBoundingClientRect()
          };
        }),
        takeUntil(mouseup1)
      )
    })
  )

  b.subscribe((x) => {
    console.log('mousemove: ', x);
    target1.style.top = x.top + 'px';
    target1.style.left = x.left + 'px';
  })

  const c = combineLatest([a, b]).pipe(
    map((x) => {
      const toggle = !(x[1].posRectangle.left > x[0].posRectangle.right || 
        x[1].posRectangle.right < x[0].posRectangle.left || 
        x[1].posRectangle.top > x[0].posRectangle.bottom ||
        x[1].posRectangle.bottom < x[0].posRectangle.top);
      // console.log("COORDINATOR", x[0].posRectangle);
      return toggle;
    }),
    tap(toggle => {
      return toggle ? target2.style.background = 'yellow' : target2.style.background = 'green';
    }),
    tap(toggle => {
      toggle ? target.style.background = 'red' : target.style.background = 'black';
      toggle ? target1.style.background = 'black' : target1.style.background = 'red';
    })
  )

  c.subscribe(x => console.log(x));
