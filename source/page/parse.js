
/**
 * @class MathParser - used to create MathParser object. Capable of parsing strings in to mathematical functions represented
 * as lambda or arrow functions. Can only handle one dependent variable and the following mathematical expressions:
 * addition, subtraction, multiplication, division, sin, cos, natural log, power of.
*/
class MathParser {
    // pi unicode.
    #pi = '\u03C0';
    // ******************************************************Regex matches********************************************************************** 
    #hasSubexpr;
    #hasTerm; // Term consisting of "e", \u03C0, 0-9 and/or dependent variable.
    #isTerm; // Term consisting of "e", \u03C0, 0-9 and/or dependent variable.
    #empty = /^$/; // Empty term/expression
    #hasPi = new RegExp(this.#pi); // Expression containing \u03C0
    #hasE = /e/; // Expression containing "e"
    #hasWhitespace = /\s/g; // Expression with whitespaces
    #hasDep; // Expression containing dependent variable
    #isAdd = /^(.*?)\+(.*)$/; // Addition-expression
    #isSub = /^(.+?)\-(.*)$/; // Subtraction-expression
    #isNeg = /^-(.+?)$/; // Negated expression.
    #isMul = /^(.+)\*([^+-]+$)/; // Multiplication-expression
    #isDiv = /^(.+)\/([^+-]+$)/; // Division-expression
    #isSin = /^sin\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // Sin-expr
    #isCos = /^cos\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // Cos-expr
    #isLn = /^ln\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // ln-expr
    #isExp; // Power of-expression.
    #isPar = /^\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)$/; // Expression wholly in parentheses.
    
    /**
    * Creates a parser capable of parsing mathematical expressions with (only one) specified dependent variable.
    * @param {String} variable - The dependent variable, for example "x", only alphabetical characters.
    */
    constructor(variable) {
        if(!new RegExp("^[a-zA-Z]+$").test(variable))
            throw new Error("The dependant variable may only consist of alphabetical characters.");
        var hasTermString = "[" + variable + this.#pi + "e0-9]";
        var notNumberString = "["+this.#pi+"e"+variable+"]";
        this.#hasTerm = new RegExp(hasTermString+"+");
        this.#isTerm = new RegExp("^" + hasTermString + "+$");
        this.#hasDep = new RegExp(variable);
        //this.#hasSubexpr = new RegExp("("+hasTermString+"+|\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\))");
        
        this.#isExp = new RegExp("^(?:(\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\))|("+hasTermString+"*)("+notNumberString+"{1})|("+notNumberString+"*)([0-9]+))\\^(\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)|"+hasTermString+"+)$");
        alert(this.#isExp.toString());
        
    }
    
    // ******************************************************Class methods********************************************************************** 
    
    balanced(str) {
        let isBalanced = true;
        openCnt=0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === "(") {
                openCnt++;
            } else if (str[i] === ")") {
                if (openCnt < 1){
                    isBalanced=false;
                    break;
                }else {
                    openCnt--;
                }
            }
        }
        isBalanced = openCnt==0 ? true : false;
        return isBalanced;
     }

    /**
    * Parses mathematical expression, and returns corresponding js-function.
    * @param {String} expr - Mathematical expression with only one dependent variable to be parsed.
    * @returns {Function} - Corresponding function
    */
    parse(expr) {
        expr = expr.replace(this.#hasWhitespace,''); // Remove all whitespaces for easier regex matching.
        expr = expr.replace(/pi/g,this.#pi); // Replace all "pi" with \u03C0 for easier regex matching.
        alert("Input string: " + expr);
        return this.#parse_expr(expr);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_expr(expr){
        console.log(expr);
        if(this.#isPar.test(expr))
		    return this.#parse_par(expr);
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
        console.log(match);
        if(match[1] == undefined){
            if(match[2] == undefined){
                if(match[4] === "")
                    return (dep) => Math.pow(this.#parse_expr(match[5])(dep),this.#parse_expr(match[6])(dep));
                else
                    return (dep) => this.#parse_expr(match[4])(dep) * Math.pow(this.#parse_expr(match[5])(dep),this.#parse_expr(match[6])(dep));
            }
            if(match[5] == undefined){
                if(match[2] === "")
                    return (dep) => Math.pow(this.#parse_expr(match[3])(dep),this.#parse_expr(match[6])(dep));
                else
                    return (dep) => this.#parse_expr(match[2])(dep) * Math.pow(this.#parse_expr(match[3])(dep),this.#parse_expr(match[6])(dep));
            }
        }
        return (dep) => Math.pow(this.#parse_expr(match[1])(dep),this.#parse_expr(match[6])(dep));
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    #parse_par(expr){
        var match = expr.match(this.#isPar);
        return (dep) => this.#parse_expr(match[1])(dep);
    }
}
