class MathParser {
    // Regex matchningar klibba in i https://regexr.com/ för föklaringar
    #term = /^[eπ0-9]*$/; // Term bestående av ett tal och/eller en varibel(t) och/eller pi
    #empty = /^$/;
    #hasPi = /π|pi/;
    #hasE = /e/;
    #hasDep;
    #dep;
    #pi = /^[0-9π]*$/; // Tal med pi-koefficient
    #num = /^[0-9]*$/; // Tal
    #add = /(^.*?)\+(.*)/; // Additionsuttryck
    #sub = /(^.*?)\-(.*)/; // Subtraktionsuttryck
    #mul = /(.+)\*([^+-]+)/; // Multiplikationsuttryck
    #div = /(.+)\/([^+-]+)/; // Divisionsuttryck
    #sin = /^sin\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // Sin-uttryck
    #cos = /^cos\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // Cos-uttryck
    #ln = /^ln\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)$/; // ln-uttryck
    #exp = /^(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[0-9tπ])\^(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|[0-9tπ])$/; // Exponent-uttryck
    #par = /^\((.*)\)$/; // Uttryck helt inom paranteser.
    
    /**
    * @param {String} variable - The dependent variable, for example "t".
    */
    constructor(variable) {
        this.#hasDep = new RegExp("${variable}");
        this.#dep = new RegExp("^${variable}$");
    }
    /**
    * @param {String} expr - Mathematical expression to be parsed.
    */
    parse(expr) {
        
    }
    /**
    * @param {String} expr - Mathematical term to be parsed.
    */
    parse_term(expr){
        
        var piOccurances = expr.match(this.#hasPi).length;
        if(piOccurances > 0)
            return (dep) => piOccurances * Math.PI * this.parse_term(expr.replace(this.#hasPi,''))(dep);
        var eOccurances = expr.match(this.#hasE).length;
        if(eOccurances > 0)
            return (dep) => eOccurances * Math.E * this.parse_term(expr.replace(this.#hasE,''))(dep);
        
        
    }
    

}