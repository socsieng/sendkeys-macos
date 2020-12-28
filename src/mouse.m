#include <time.h>
#include <errno.h>    
#include <inttypes.h>
#include <math.h>

#include <Foundation/Foundation.h>
#include <ApplicationServices/ApplicationServices.h>

int msleep(long msec)
{
    struct timespec ts;
    int res;

    if (msec < 0)
    {
      errno = EINVAL;
      return -1;
    }

    ts.tv_sec = msec / 1000;
    ts.tv_nsec = (msec % 1000) * 1000000;

    do {
      res = nanosleep(&ts, &ts);
    } while (res && errno == EINTR);

    return res;
}

void setMousePosition(int x, int y, CGEventType state, CGMouseButton button) {
  CGEventRef move = CGEventCreateMouseEvent(
    NULL, state, // kCGEventMouseMoved,
    CGPointMake(x, y),
    button
  );

  CGEventPost(kCGHIDEventTap, move);

  CFRelease(move);
}

CGMouseButton getMouseButton(NSString *clickType) {
  CGMouseButton button = kCGMouseButtonLeft;

  if ([clickType isEqual:@"center"]) {
    button = kCGMouseButtonCenter;
  } else if ([clickType isEqual:@"right"]) {
    button = kCGMouseButtonRight;
  }

  return button;
}

void click(int x, int y, NSString *clickType, int clickCount) {
  CGEventType downEvent = kCGEventLeftMouseDown;
  CGEventType upEvent = kCGEventLeftMouseUp;
  CGMouseButton button = getMouseButton(clickType);

  if ([clickType isEqual:@"center"] || [clickType isEqual:@"right"]) {
    downEvent = kCGEventOtherMouseDown;
    upEvent = kCGEventOtherMouseUp;
  }

  CGEventRef down = CGEventCreateMouseEvent(
    NULL, downEvent,
    CGPointMake(x, y),
    button
  );
  CGEventSetIntegerValueField(down, kCGMouseEventClickState, clickCount);

  CGEventRef up = CGEventCreateMouseEvent(
    NULL, upEvent,
    CGPointMake(x, y),
    button
  );

  CGEventPost(kCGHIDEventTap, down);
  CGEventPost(kCGHIDEventTap, up);

  CFRelease(down);
  CFRelease(up);
}

float easeInOutQuad(float x) {
  return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
}

int easePosition(int min, int max, float progress) {
  return ((max - min) * easeInOutQuad(progress)) + min;
}

long getCurrentMilliseconds() {
  struct timespec currentTime;
  clock_gettime(CLOCK_REALTIME, &currentTime);

  return round(currentTime.tv_nsec / 1.0e6) + (currentTime.tv_sec * 1000);
}

void move(int x1, int y1, int x2, int y2, int duration, NSString *drag) {
  struct timespec ts;
  int res;
  long startMilliseconds = getCurrentMilliseconds();
  long currentMilliseconds;

  CGEventType moveType = kCGEventMouseMoved;
  CGEventType downEvent = kCGEventLeftMouseDown;
  CGEventType upEvent = kCGEventLeftMouseUp;
  CGMouseButton button = getMouseButton(drag);
  CGEventRef down;
  CGEventRef up;

  // start drag
  if (drag != nil) {
    moveType = kCGEventOtherMouseDragged;

    if ([drag isEqual:@"center"] || [drag isEqual:@"right"]) {
      moveType = kCGEventLeftMouseDragged;
      downEvent = kCGEventOtherMouseDown;
      upEvent = kCGEventOtherMouseUp;
    }

    down = CGEventCreateMouseEvent(
      NULL, downEvent,
      CGPointMake(x1, y1),
      button
    );
    up = CGEventCreateMouseEvent(
      NULL, upEvent,
      CGPointMake(x2, y2),
      button
    );

    CGEventPost(kCGHIDEventTap, down);
  }

  ts.tv_sec = duration / 1000;
  ts.tv_nsec = (duration % 1000) * 1000000;

  setMousePosition(x1, y1, moveType, button);

  do {
    msleep(1);

    currentMilliseconds = getCurrentMilliseconds();
    float progress = (float)(currentMilliseconds - startMilliseconds) / (float)duration;
    if (progress > 1) {
      progress = 1;
    }

    int x = easePosition(x1, x2, progress);
    int y = easePosition(y1, y2, progress);

    setMousePosition(x, y, moveType, button);
  } while (currentMilliseconds - startMilliseconds <= duration);

  setMousePosition(x2, y2, moveType, button);

  // stop drag
  if (drag != nil) {
    CGEventPost(kCGHIDEventTap, up);

    CFRelease(down);
    CFRelease(up);
  }
}

CGPoint getCurrentMousePosition() {
  CGEventRef event = CGEventCreate(nil);
  CGPoint mouseLocation = CGEventGetLocation(event);
  CFRelease(event);

  return mouseLocation;
}

int main(int argc, char *argv[]) {
  NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];
  NSUserDefaults *args = [NSUserDefaults standardUserDefaults];

  int x1 = [args integerForKey:@"x1"];
  int y1 = [args integerForKey:@"y1"];
  int x2 = [args integerForKey:@"x2"];
  int y2 = [args integerForKey:@"y2"];
  int duration = [args integerForKey:@"duration"];
  NSString *drag = [args stringForKey:@"drag"];
  NSString *clickType = [args stringForKey:@"click"];
  int clickCount = [args integerForKey:@"clicks"];
  int clickDelay = [args integerForKey:@"clickDelay"];

  CGPoint mouseLocation = getCurrentMousePosition();

  if (argc == 1) {
    printf("current position: %d, %d\n", (int)mouseLocation.x, (int)mouseLocation.y);
    return 0;
  }

  // use current mouse position
  if ([args objectForKey:@"x1"] == nil) {
    x1 = mouseLocation.x;
  }
  if ([args objectForKey:@"y1"] == nil) {
    y1 = mouseLocation.y;
  }

  if ([args objectForKey:@"x2"] == nil) {
    x2 = x1;
  }
  if ([args objectForKey:@"y2"] == nil) {
    y2 = y1;
  }

  move(x1, y1, x2, y2, duration, drag);

  if (clickCount == 0 && clickType != nil) {
    clickCount = 1;
  }

  if (clickCount > 0) {
    msleep(clickDelay);
    click(x2, y2, clickType, clickCount);
  }

  [pool release];
  return 0;
}
