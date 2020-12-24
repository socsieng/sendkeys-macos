const splitter = require('./splitter');
const expect = require('chai').expect;

describe('splitter', () => {
  describe('single expression', () => {
    it('should split single expression', () => {
      const result = splitter.splitIncluding('hello<space>world', [/\<space\>/g]);

      expect(result).to.be.eql(['hello', '<space>', 'world']);
    });

    it('should split consecutive single expression', () => {
      const result = splitter.splitIncluding('hello<space><space>world', [/\<space\>/g]);

      expect(result).to.be.eql(['hello', '<space>', '<space>', 'world']);
    });

    it('should split single expression at start', () => {
      const result = splitter.splitIncluding('<space>world', [/\<space\>/g]);

      expect(result).to.be.eql(['<space>', 'world']);
    });

    it('should split single expression at end', () => {
      const result = splitter.splitIncluding('world<space>', [/\<space\>/g]);

      expect(result).to.be.eql(['world', '<space>']);
    });

    it('should split single expression near end', () => {
      const result = splitter.splitIncluding('world<space>a', [/\<space\>/g]);

      expect(result).to.be.eql(['world', '<space>', 'a']);
    });

    it('should throw for non global expressions', () => {
      expect(() => splitter.splitIncluding('<space>world', [/\<space\>/])).to.throw('Expression must be global');
    });
  });

  describe('multiple expressions', () => {
    it('should split multiple expression', () => {
      const result = splitter.splitIncluding('hello<space><tab>world', [/\<space\>/g, /\<tab\>/g]);

      expect(result).to.be.eql(['hello', '<space>', '<tab>', 'world']);
    });

    it('should split multiple expression at beginning and end', () => {
      const result = splitter.splitIncluding('<space>hello<tab>world<tab>', [/\<space\>/g, /\<tab\>/g]);

      expect(result).to.be.eql(['<space>', 'hello', '<tab>', 'world', '<tab>']);
    });
  });
});
