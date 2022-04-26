class MathParser {
    // Regex matchningar klibba in i https://regexr.com/ för föklaringar
    #isTerm; // Term bestående av ett tal och/eller e och/eller pi
    #empty = /^$/;
    #hasPi = /π|pi/;
    #hasE = /e/;
    #hasWhitespace = /\s/g;
    
    #hasDep;
    #dep;
    #pi = /^[0-9π]*$/; // Tal med pi-koefficient
    #num = /^[0-9]*$/; // Tal
    
    #isAdd = /^(.*?)\+(.*)$/; // Additionsuttryck
    #isSub = /^(.+?)\-(.*)$/; // Subtraktionsuttryck
    #isNeg = /^-(.+?)$/;
    #isMul = /^(.+)\*([^+-]+$)/; // Multiplikationsuttryck
    #isDiv = /^(.+)\/([^+-]+$)/; // Divisionsuttryck
    #isSin = /^sin\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // Sin-uttryck
    #isCos = /^cos\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // Cos-uttryck
    #isLn = /^ln\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // ln-uttryck
    #isExp = /^(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[0-9etπpi]*[0-9etπpi]{1})\^(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[0-9etπpi]*[0-9etπpi]{1})$/; // Exponent-uttryck
    #isPar = /^\((.*)\)$/; // Uttryck helt inom paranteser.
    
    /**
    * Creates a parser capable of parsing mathematical expressions with specified dependent variable.
    * @param {String} variable - The dependent variable, for example "t".
    */
    constructor(variable) {
        this.#isTerm = new RegExp("^[" + variable + "epi0-9]*$");
        this.#hasDep = new RegExp(variable);
        this.#dep = new RegExp("^" + variable + "$");
        this.#isExp = new RegExp("^(\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)|([0-9eπpi"+variable+"]*)([0-9eπpi"+variable+"]{1}))\\^(\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)|[0-9eπpi"+variable+"]*[0-9eπpi"+variable+"]{1})$");
    }

    /**
    *  
    * @param {String} expr - Mathematical expression to be parsed.
    */
    balance(expr){
        
        var balanced = true;
        var cnt=0;
        var openCnt=0;
        while(cnt < expr.length){
            switch (expr.charAt(cnt)) {
                case '(':
                    openCnt++;
                    break;
                case ')':
                    if(openCnt>0)
                        openCnt--;
                    else{
                        balanced=false;
                        break;}
                    break;
                default:
                    break;
            }
            
        }
    }


    /**
    *  
    * @param {String} expr - Mathematical expression to be parsed.
    */
    parse(expr) {
        expr = expr.replace(this.#hasWhitespace,'');
        if(this.#isPar.test(expr))
		    return this.parse_par(expr);
        if(this.#isTerm.test(expr))
            return this.parse_term(expr);
        if(this.#isNeg.test(expr))
            return this.parse_neg(expr);
        if(this.#isSin.test(expr))
            return this.parse_sin(expr);
        if(this.#isCos.test(expr))
            return this.parse_cos(expr);
        if(this.#isLn.test(expr))
            return this.parse_ln(expr);
        if(this.#isExp.test(expr))
            return this.parse_exp(expr);
        if(this.#isAdd.test(expr))
            return this.parse_add(expr);
        if(this.#isSub.test(expr))
            return this.parse_sub(expr);
        if(this.#isMul.test(expr))
            return this.parse_mul(expr);
        if(this.#isDiv.test(expr))
            return this.parse_div(expr);
        alert(expr);
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
        var match = expr.match(this.#isAdd);
        return (t) => this.parse(match[1])(t) + this.parse(match[2])(t);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_sub(expr){
        var match = expr.match(this.#isSub);
        return (t) => this.parse(match[1])(t) - this.parse(match[2])(t);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_neg(expr){
        var match = expr.match(this.#isNeg);
        return (t) => -1 * this.parse(match[1])(t);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_mul(expr){
        var match = expr.match(this.#isMul);
        return (t) => this.parse(match[1])(t) * this.parse(match[2])(t);
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_div(expr){
        var match = expr.match(this.#isDiv);
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
        var match = expr.substring(4,expr.length-1);
        if(match === "")
            return (t) => {throw new Error("Nothin inside sin");}
        //var match = expr.match(this.#isSin);
        return (t) => Math.sin(this.parse(match)(t));
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_cos(expr){
        var match = expr.substring(4,expr.length-1);
        if(match === "")
            return (t) => {throw new Error("Nothin inside cos");}
        //var match = expr.match(this.#isSin);
        return (t) => Math.sin(this.parse(match)(t));
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_ln(expr){
        var match = expr.substring(3,expr.length-1);
        if(match === "")
            return (t) => {throw new Error("Nothin inside ln");}
        return (t) => {
            var log = Math.log(this.parse(match)(t));
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
    parse_exp(expr){
        var match = expr.match(this.#isExp);
        if(match[2] == undefined)
            return (t) => Math.pow(this.parse(match[1])(t),this.parse(match[4])(t));
        return (t) => this.parse(match[2])(t) * Math.pow(this.parse(match[3])(t),this.parse(match[4])(t));
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_par(expr){
        var match = expr.match(this.#isPar);
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