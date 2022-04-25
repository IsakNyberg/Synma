class MathParser {
    // Regex matchningar klibba in i https://regexr.com/ för föklaringar
    #term; // Term bestående av ett tal och/eller e och/eller pi
    #empty = /^$/;
    #hasPi = /π|pi/;
    #hasE = /e/;
    #hasWhitespace = /\s/g;
    
    #hasDep;
    #dep;
    #pi = /^[0-9π]*$/; // Tal med pi-koefficient
    #num = /^[0-9]*$/; // Tal
    
    #add = /(^.*?)\+(.*)/; // Additionsuttryck
    #sub = /(^.+?)\-(.*)/; // Subtraktionsuttryck
    #neg = /^-(.+?)$/;
    #mul = /(.+)\*([^+-]+)/; // Multiplikationsuttryck
    #div = /(.+)\/([^+-]+)/; // Divisionsuttryck
    #sin = /^sin\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // Sin-uttryck
    #cos = /^cos\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // Cos-uttryck
    #ln = /^ln\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // ln-uttryck
    #exp = /^(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[0-9tπ])\^(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[0-9tπ])$/; // Exponent-uttryck
    #par = /^\((.*)\)$/; // Uttryck helt inom paranteser.
    
    /**
    * Creates a parser capable of parsing mathematical expressions with specified dependent variable.
    * @param {String} variable - The dependent variable, for example "t".
    */
    constructor(variable) {
        this.#term = new RegExp("^[" + variable + "epi0-9]*$");
        this.#hasDep = new RegExp(variable);
        this.#dep = new RegExp("^" + variable + "$");
    }
    /**
    *  
    * @param {String} expr - Mathematical expression to be parsed.
    */
    parse(expr) {
        expr = expr.replace(this.#hasWhitespace,'');
        if(this.#term.test(expr))
            return this.parse_term(expr);
        if(this.#add.test(expr))
            return this.parse_add(expr);
        if(this.#sub.test(expr))
            return this.parse_sub(expr);
        if(this.#neg.test(expr))
            return this.parse_neg(expr);
        if(this.#mul.test(expr))
            return this.parse_mul(expr);
        if(this.#div.test(expr))
            return this.parse_div(expr);
        if(this.#sin.test(expr))
            return this.parse_sin(expr);
        if(this.#cos.test(expr))
            return this.parse_cos(expr);
        if(this.#ln.test(expr))
            return this.parse_ln(expr);
        if(this.#exp.test(expr))
            return this.parse_exp(expr);
        
        return (dep) => 0;
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_term(expr){
        if(this.#empty.test(expr))
            return (dep) => 1;
        var depOccurances = expr.match(this.#hasDep);
        if(depOccurances != null)
            return (dep) => depOccurances.length * dep * this.parse_term(expr.replace(this.#hasDep,''))(dep);
        var piOccurances = expr.match(this.#hasPi);
        if(piOccurances != null)
            return (dep) => piOccurances.length * Math.PI * this.parse_term(expr.replace(this.#hasPi,''))(dep);
        var eOccurances = expr.match(this.#hasE);
        if(eOccurances != null)
            return (dep) => eOccurances.length * Math.E * this.parse_term(expr.replace(this.#hasE,''))(dep);
        return (dep) => parseInt(expr);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_add(expr){
        var match = expr.match(this.#add);
        return (t) => this.parse(match[1])(t) + this.parse(match[2])(t);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_sub(expr){
        var match = expr.match(this.#sub);
        return (t) => this.parse(match[1])(t) - this.parse(match[2])(t);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_neg(expr){
        var match = expr.match(this.#neg);
        return (t) => -1 * this.parse(match[1])(t);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_mul(expr){
        var match = expr.match(this.#mul);
        return (t) => this.parse(match[1])(t) * this.parse(match[2])(t);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_div(expr){
        var match = expr.match(this.#div);
        return (t) => {
            var reciprocal = this.parse(match[2])(t);
            if(reciprocal == 0)
                throw new Error("Division by zero.");
            else
                return this.parse(match[1])(t) / this.parse(match[2])(t);
        }
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_sin(expr){
        var match = expr.match(this.#sin);
        return (t) => Math.sin(this.parse(match[1])(t));
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_cos(expr){
        var match = expr.match(this.#cos);
        return (t) => Math.cos(this.parse(match[1])(t));
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_ln(expr){
        var match = expr.match(this.#ln);
        return (t) => {
            var log = Math.log(this.parse(match[1])(t));
            if(isNaN(log))
                throw new Error("Undefined operation.");
            else
                return log;
        }
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_exp(expr){
        var match = expr.match(this.#exp);
        return (t) => Math.pow(this.parse(match[1])(t),this.parse(match[2])(t));
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_par(expr){
        var match = expr.match(this.#par);
        return (t) => this.parse(match[1])(t);
    }
    
    

}
function bootstrap() {
    var expr = document.getElementById("expr").value;
    var dep = document.getElementById("dep").value;
    var val = document.getElementById("val").value;
    
    var parser = new MathParser(dep);
    func = parser.parse(expr);
    try{
        alert(func(parseInt(val)));
    }catch(err){
        alert(err.message);
    }
}