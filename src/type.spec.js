const type = require('./type');
const sinon = require('sinon');
const expect = require('chai').expect;

function charactSequenceFromKeystrokes(keystrokeCalls) {
  return keystrokeCalls.map(call => call.args[0]).join('');
}

describe('type', () => {
  const delay = sinon.spy();
  const keycode = sinon.spy();
  const keystroke = sinon.spy();

  const sysevents = {
    keyCode: keycode,
    keystroke,
  };

  beforeEach(() => {
    delay.resetHistory();
    keycode.resetHistory();
    keystroke.resetHistory();
  });

  it('should not fail when empty', () => {
    type('', 0.1, { delay, sysevents });

    expect(keystroke.called).to.equal(false);
    expect(delay.called).to.equal(false);
  });

  describe('keystrokes', () => {
    it('should send single keystroke', () => {
      type('1', 0.1, { delay, sysevents });

      expect(keystroke.calledWith('1')).to.equal(true);
      expect(delay.calledWith(0.1)).to.equal(true);
    });

    it('should send two keystrokes', () => {
      type('12', 0.1, { delay, sysevents });

      const keystrokeCalls = keystroke.getCalls();
      expect(keystrokeCalls).to.have.lengthOf(2);
      expect(keystrokeCalls[0].args[0]).to.equal('1');
      expect(keystrokeCalls[1].args[0]).to.equal('2');
      expect(delay.callCount).to.equal(2);
    });
  });

  describe('keycodes', () => {
    it('should send up keycode', () => {
      type('<c:up>', 0.1, { delay, sysevents });

      expect(keycode.calledWith(126, { using: [] })).to.equal(true);
    });

    it('should send up keycode with command down', () => {
      type('<c:up:command>', 0.1, { delay, sysevents });

      expect(keycode.calledWith(126, { using: ['command down'] })).to.equal(true);
    });

    it('should send up keycode with command down alias ⌘', () => {
      type('<c:up:⌘>', 0.1, { delay, sysevents });

      expect(keycode.calledWith(126, { using: ['command down'] })).to.equal(true);
    });

    it('should send up keycode with command down alias cmd', () => {
      type('<c:up:cmd>', 0.1, { delay, sysevents });

      expect(keycode.calledWith(126, { using: ['command down'] })).to.equal(true);
    });

    it('should send up keycode with multiple modifier keys', () => {
      type('<c:up:command,control,option,shift>', 0.1, { delay, sysevents });

      expect(
        keycode.calledWith(126, { using: ['command down', 'control down', 'option down', 'shift down'] }),
      ).to.equal(true);
    });

    it('should send up keycode with multiple modifier keys ignoring extra commas', () => {
      type('<c:up:,command,control,option,,>', 0.1, { delay, sysevents });

      expect(keycode.calledWith(126, { using: ['command down', 'control down', 'option down'] })).to.equal(true);
    });

    it('should not send keycodes when character sequence is upper case (C)', () => {
      type('<C:up:command,control,option,shift>', 0.1, { delay, sysevents });

      expect(keycode.notCalled).to.equal(true);
    });
  });

  describe('delays', () => {
    it('should pause for 1 second', () => {
      type('<p:1>', 0.1, { delay, sysevents });

      const delayCalls = delay.getCalls();
      expect(delayCalls[0].args).to.eql([1]);
    });

    it('should pause for 1.5 seconds', () => {
      type('<p:1.5>', 0.1, { delay, sysevents });

      const delayCalls = delay.getCalls();
      expect(delayCalls[0].args).to.eql([1.5]);
    });

    it('should pause for 1 and 1.5 seconds', () => {
      type('<p:1><p:1.5>', 0.1, { delay, sysevents });

      const delayCalls = delay.getCalls();
      expect(delayCalls[0].args).to.eql([1]);
      expect(delayCalls[1].args).to.eql([1.5]);
    });

    it('should pause for 1 and 1.5 seconds with character in between', () => {
      type('<p:1>a<p:1.5>', 0.1, { delay, sysevents });

      const delayCalls = delay.getCalls();
      expect(delayCalls[0].args).to.eql([1]);
      expect(delayCalls[1].args).to.eql([1.5]);
    });

    it('should pause for 1 second and revert to default', () => {
      type('<p:1>a', 0.1, { delay, sysevents });

      const delayCalls = delay.getCalls();
      expect(delayCalls[0].args).to.eql([1]);
      expect(delayCalls[1].args).to.eql([0.1]);
    });

    it('should ignore upper case pause', () => {
      type('<P:1>a', 0.1, { delay, sysevents });

      const sequence = charactSequenceFromKeystrokes(keystroke.getCalls());

      expect(sequence).to.equal('<P:1>a');
      expect(delay.callCount).to.equal(6);
    });
  });

  describe('continuations', () => {
    it('should do nothing when only character is a continuation', () => {
      type('<\\>', 0.1, { delay, sysevents });

      expect(keystroke.called).to.equal(false);
      expect(delay.called).to.equal(false);
    });

    it('should ignore the next character after continuation', () => {
      type('<\\>a', 0.1, { delay, sysevents });

      expect(keystroke.called).to.equal(false);
      expect(delay.called).to.equal(false);
    });

    it('should ignore the next character after continuation, but continue with next', () => {
      type('<\\>ab', 0.1, { delay, sysevents });

      expect(keystroke.calledWith('b')).to.equal(true);
      expect(delay.calledWith(0.1)).to.equal(true);
    });

    it('should ignore the first character in pause sequence', () => {
      type('<\\><p:1>', 0.1, { delay, sysevents });

      const sequence = charactSequenceFromKeystrokes(keystroke.getCalls());

      expect(sequence).to.equal('p:1>');
    });

    it('should ignore the first character in keycode sequence', () => {
      type('<\\><c:up:shift>', 0.1, { delay, sysevents });

      const sequence = charactSequenceFromKeystrokes(keystroke.getCalls());

      expect(sequence).to.equal('c:up:shift>');
    });
  });
});
