
/**
 * @class MathParser - used to create MathParser object. Capable of parsing strings in to mathematical functions represented
 * as lambda or arrow functions. Can only handle one dependent variable and the following mathematical expressions:
 * addition, subtraction, multiplication, division, sin, cos, natural log, power of.
*/
class MathParser {
    // ******************************************************Regex matches********************************************************************** 
    #isTerm; // Term consisting of "e", "pi", 0-9 and/or dependent variable.
    #empty = /^$/; // Empty term/expression
    #hasPi = /π|pi/; // Expression containing "pi"
    #hasE = /e/; // Expression containing "e"
    #hasWhitespace = /\s/g; // Expression with whitespaces
    #hasDep; // Expression containing dependent variable
    #isAdd = /^(.*?)\+(.*)$/; // Addition-expression
    #isSub = /^(.+?)\-(.*)$/; // Subtraction-expression
    #isNeg = /^-(.+?)$/; 
    #isMul = /^(.+)\*([^+-]+$)/; // Multiplication-expression
    #isDiv = /^(.+)\/([^+-]+$)/; // Division-expression
    #isSin = /^sin\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // Sin-expr
    #isCos = /^cos\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // Cos-expr
    #isLn = /^ln\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // ln-expr
    #isExp = /^(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[0-9etπpi]*[0-9etπpi]{1})\^(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[0-9etπpi]*[0-9etπpi]{1})$/; // Exponent-expr
    #isPar = /^\((.*)\)$/; // Expression wholly in parentheses.
    
    /**
    * Creates a parser capable of parsing mathematical expressions with (only one) specified dependent variable.
    * @param {String} variable - The dependent variable, for example "x", only alphabetical characters.
    */
    constructor(variable) {
        if(!new RegExp("^[a-zA-Z]+$").test(variable))
            throw new Error("The dependant variable may only consist of alphabetical characters.");
        this.#isTerm = new RegExp("^[" + variable + "epi0-9]*$");
        this.#hasDep = new RegExp(variable);
        this.#isExp = new RegExp("^(\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)|([0-9eπpi"+variable+"]*)([0-9eπpi"+variable+"]{1}))\\^(\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)|[0-9eπpi"+variable+"]*[0-9eπpi"+variable+"]{1})$");
    }
    
    // ******************************************************Class methods********************************************************************** 
    
    /**
    * Parses mathematical expression, and returns corresponding js-function.
    * @param {String} expr - Mathematical expression with only one dependent variable to be parsed.
    * @returns {Function} - Corresponding function
    */
    parse(expr) {
        expr = expr.replace(this.#hasWhitespace,'');
        return this.#parse_expr(expr);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_expr(expr){
        if(this.#isTerm.test(expr))
            return this.#parse_term(expr);
        if(this.#isNeg.test(expr))
            return this.#parse_neg(expr);
        if(this.#isSin.test(expr))
            return this.#parse_sin(expr);
        if(this.#isCos.test(expr))
            return this.#parse_cos(expr);
        if(this.#isLn.test(expr))
            return this.#parse_ln(expr);
        if(this.#isExp.test(expr))
            return this.#parse_exp(expr);
        if(this.#isAdd.test(expr))  
            return this.#parse_add(expr);
        if(this.#isSub.test(expr))
            return this.#parse_sub(expr);
        if(this.#isMul.test(expr))
            return this.#parse_mul(expr);
        if(this.#isDiv.test(expr))
            return this.#parse_div(expr);
        if(this.#isPar.test(expr))
		    return this.#parse_par(expr);
        return (dep) => {throw new Error("\"" + expr + "\" Not recognized.");}
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_term(expr){
        if(this.#empty.test(expr))
            return (dep) => 1;
        var depOccurances = expr.match(this.#hasDep);
        if(depOccurances != null)
            return (dep) => depOccurances.length * dep * this.#parse_term(expr.replace(this.#hasDep,''))(dep);
        var piOccurances = expr.match(this.#hasPi);
        if(piOccurances != null)
            return (dep) => piOccurances.length * Math.PI * this.#parse_term(expr.replace(this.#hasPi,''))(dep);
        var eOccurances = expr.match(this.#hasE);
        if(eOccurances != null)
            return (dep) => eOccurances.length * Math.E * this.#parse_term(expr.replace(this.#hasE,''))(dep);
        return (dep) => parseInt(expr);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_add(expr){
        var match = expr.match(this.#isAdd);
        return (dep) => this.#parse_expr(match[1])(dep) + this.#parse_expr(match[2])(dep);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_sub(expr){
        var match = expr.match(this.#isSub);
        return (dep) => this.#parse_expr(match[1])(dep) - this.#parse_expr(match[2])(dep);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_neg(expr){
        var match = expr.match(this.#isNeg);
        return (dep) => -1 * this.#parse_expr(match[1])(dep);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_mul(expr){
        var match = expr.match(this.#isMul);
        return (dep) => this.#parse_expr(match[1])(dep) * this.#parse_expr(match[2])(dep);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_div(expr){
        var match = expr.match(this.#isDiv);
        return (dep) => {
            var reciprocal = this.#parse_expr(match[2])(dep);
            if(reciprocal == 0)
                throw new Error("Division by zero.");
            else
                return this.#parse_expr(match[1])(dep) / this.#parse_expr(match[2])(dep);
        }
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_sin(expr){
        var match = expr.substring(4,expr.length-1);
        if(match === "")
            return (dep) => {throw new Error("Nothing inside sin");}
        //var match = expr.match(this.#isSin);
        return (dep) => Math.sin(this.#parse_expr(match)(dep));
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_cos(expr){
        var match = expr.substring(4,expr.length-1);
        if(match === "")
            return (dep) => {throw new Error("Nothin inside cos");}
        //var match = expr.match(this.#isSin);
        return (dep) => Math.cos(this.#parse_expr(match)(dep));
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_ln(expr){
        var match = expr.substring(3,expr.length-1);
        if(match === "")
            return (dep) => {throw new Error("Nothin inside ln");}
        return (dep) => {
            var log = Math.log(this.#parse_expr(match)(dep));
            alert(log);
            if(isNaN(log))
                throw new Error("Undefined operation.");
            else
                return log;
        }
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_exp(expr){
        var match = expr.match(this.#isExp);
        if(match[2] == undefined)
            return (dep) => Math.pow(this.#parse_expr(match[1])(dep),this.#parse_expr(match[4])(dep));
        return (dep) => this.#parse_expr(match[2])(dep) * Math.pow(this.#parse_expr(match[3])(dep),this.#parse_expr(match[4])(dep));
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_par(expr){
        var match = expr.match(this.#isPar);
        return (dep) => this.#parse_expr(match[1])(dep);
    }
}
function bootstrap() {
    var expr = document.getElementById("expr").value;
    var dep = document.getElementById("dep").value;
    var val = document.getElementById("val").value;
    try{
        var parser = new MathParser(dep);
        func = parser.parse(expr);
        alert(func(parseInt(val)));
    }catch(err){
        alert(err.message);
    }
}