/**
 * @class MathParser - used to create MathParser object. Capable of parsing strings in to mathematical 
 * functions represented as lambda or arrow functions. Can only handle one dependent variable and the 
 * following mathematical expressions:
 * addition, subtraction, multiplication, division, sin, cos, natural log, power of.
*/
class MathParser {
	// pi unicode.
	#pi = '\u03C0';
	// ******************************************************Regex matches*************************** 
	#hasWhitespace = /\s/g; // Expression with whitespaces
	#terms = [];
	#termsR = [];
	/**
	* Creates a parser capable of parsing mathematical expressions with (only one) specified dependent variable.
	* @param {String} variable - The dependent variable, for example "x", only alphabetical characters.
	*/
	constructor(variable) {
		// Should guard against malicious injections aswell.
		if(!new RegExp("^[a-zA-Z]+$").test(variable)) {
			let message = "The dependant variable may only consist of alphabetical characters."
			if (!alert(message)) {
					throw new Error(message);
			}
		}
			
			
		// The following builds the regular expressions to determine legal terms.
		// terms[x] matches the particular pattern within another pattern, and is used to build other expressions.
		// termsR[x] matches lone patterns with the start (^) and end ($) being set. Used for testing expressions.
		this.#terms["rnd"] = "rnd";
		this.#termsR["rnd"] = new RegExp("^rnd$");
		this.#terms["num"] = "[0-9.]+";
		this.#termsR["num"] = new RegExp("^[0-9.]+$");
		this.#terms["e"] = "e";
		this.#termsR["e"] = new RegExp("^e$");
		this.#terms["pi"] = "\u03C0";
		this.#termsR["pi"] = new RegExp("^\u03c0$");
		this.#terms["dep"] = variable;
		this.#termsR["dep"] = new RegExp("^"+variable+"$");
		this.#terms["sin"] = "sin\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)";
		this.#termsR["sin"] = new RegExp("^sin\\(((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)$");
		this.#terms["cos"] = "cos\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)";
		this.#termsR["cos"] = new RegExp("^cos\\(((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)$");
		this.#terms["tan"] = "tan\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)";
		this.#termsR["tan"] = new RegExp("^tan\\(((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)$");
		this.#terms["ln"] = "ln\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)";
		this.#termsR["ln"] = new RegExp("^ln\\(((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)$");
		this.#terms["sgn"] = "sgn\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)";
		this.#termsR["sgn"] = new RegExp("^sgn\\(((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)$");
		this.#terms["abs"] = "abs\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)";
		this.#termsR["abs"] = new RegExp("^abs\\(((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)$");
		this.#terms["par"] = "\\((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*\\)";
		this.#termsR["par"] = new RegExp("^\\(((?:[^)(]+|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)$");
		var term = "";
		for (var i in this.#terms)
			term += this.#terms[i] + "|";
		term = term.substring(0,term.length-1);
		this.#terms["neg"] = "-"+term;
		this.#termsR["neg"] = new RegExp("^-("+term+")$");
		this.#terms["exp"] = "(?:"+term+")\\^(?:"+term+")";
		this.#termsR["exp"] = new RegExp("^("+term+")\\^("+term+")$");
		term = term+"|"+this.#terms["exp"]+"|(?:"+term+")(?:)(?:"+term+")";
		this.#terms["div"] = "(?:"+term+")/(?:"+term+")";
		this.#termsR["div"] = new RegExp("^("+term+")/("+term+")$");
		term = term+"|"+this.#terms["div"]+"|"+"(?:"+term+")(?:\\*|)(?:"+term+")";
		this.#terms["mul"] = "(?:"+term+")(?:\\*|)(?:"+term+")";
		this.#termsR["mul"] = new RegExp("^("+term+")(?:\\*|)("+term+")$");
		term = term+"|"+this.#terms["mul"];
		this.#terms["sub"] = term+"-(.+)$";
		this.#termsR["sub"] = new RegExp("^("+term+")(?:-)(.+)$");
		this.#terms["add"] = term+"\\+(.+)$";
		this.#termsR["add"] = new RegExp("^("+term+")(?:\\+)(.+)$");
	}
	
	// ******************************************************Class methods***************************
	/**
	* Parses mathematical expression, and returns corresponding js-function.
	* @param {String} expr - Mathematical expression with only one dependent variable to be parsed.
	* @returns {Function} - Corresponding function
	*/
	parse(expr) {
		expr = expr.replace(this.#hasWhitespace,''); // Remove all whitespaces for easier regex matching.
		expr = expr.replace(/pi/g,this.#pi); // Replace all "pi" with \u03C0 for easier regex matching.
		return this.#parse_expr(expr);
	}

	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_expr(expr){
		if(this.#termsR["sub"].test(expr)) return this.#parse_sub(expr);
		if(this.#termsR["add"].test(expr)) return this.#parse_add(expr);   
		if(this.#termsR["e"].test(expr)) 	 return (dep) => Math.E; 
		if(this.#termsR["pi"].test(expr))  return (dep) => Math.PI; 
		if(this.#termsR["dep"].test(expr)) return (dep) => parseFloat(dep); 
		if(this.#termsR["num"].test(expr)) return (dep) => parseFloat(expr);
		if(this.#termsR["neg"].test(expr)) return this.#parse_neg(expr);
		if(this.#termsR["par"].test(expr)) return this.#parse_par(expr);
		if(this.#termsR["sin"].test(expr)) return this.#parse_sin(expr);
		if(this.#termsR["cos"].test(expr)) return this.#parse_cos(expr);
		if(this.#termsR["tan"].test(expr)) return this.#parse_tan(expr);
		if(this.#termsR["ln"].test(expr))  return this.#parse_ln(expr);
		if(this.#termsR["sgn"].test(expr)) return this.#parse_sgn(expr);
		if(this.#termsR["abs"].test(expr)) return this.#parse_abs(expr);
		if(this.#termsR["exp"].test(expr)) return this.#parse_exp(expr);
		if(this.#termsR["div"].test(expr)) return this.#parse_div(expr);
		if(this.#termsR["mul"].test(expr)) return this.#parse_mul(expr);
		if(this.#termsR["rnd"].test(expr)) return (dep) => Math.random();
		return (dep) => {
			let message = "\"" + expr + "\" Not recognized."
			if (!alert(message)) {
					throw new Error(message);
			}
		}
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_add(expr){
		var match = expr.match(this.#termsR["add"]);
		return (dep) => this.#parse_expr(match[1])(dep) + this.#parse_expr(match[2])(dep);
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_sub(expr){
		var match = expr.match(this.#termsR["sub"]);
		return (dep) => this.#parse_expr(match[1])(dep) - this.#parse_expr(match[2])(dep);
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_neg(expr){
		var match = expr.match(this.#termsR["neg"]);
		return (dep) => -1 * this.#parse_expr(match[1])(dep);
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_mul(expr){
		var match = expr.match(this.#termsR["mul"]);
		return (dep) => this.#parse_expr(match[1])(dep) * this.#parse_expr(match[2])(dep);
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_div(expr){
		var match = expr.match(this.#termsR["div"]);
		return (dep) => {
			var reciprocal = this.#parse_expr(match[2])(dep);
			if(reciprocal == 0) {
				let message = "Division by zero.";
				if (!alert(message)) {
					throw new Error(message);
				}
			}
			else
				return this.#parse_expr(match[1])(dep) / this.#parse_expr(match[2])(dep);
		}
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_sin(expr){
		var match = expr.match(this.#termsR["sin"]);
		return (dep) => Math.sin(this.#parse_expr(match[1])(dep));
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_cos(expr){
		var match = expr.match(this.#termsR["cos"]);
		return (dep) => Math.cos(this.#parse_expr(match[1])(dep));
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	 #parse_tan(expr){
		var match = expr.match(this.#termsR["tan"]);
		return (dep) => Math.tan(this.#parse_expr(match[1])(dep));
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_ln(expr){
		var match = expr.match(this.#termsR["ln"]);
		return (dep) => {
			var log = Math.log(this.#parse_expr(match[1])(dep));
			if(isNaN(log))
				throw new Error("Undefined operation.");
			else
				return log;
		}
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_sgn(expr){
		var match = expr.match(this.#termsR["sgn"]);
		return (dep) => Math.sign(this.#parse_expr(match[1])(dep));
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_abs(expr){
		var match = expr.match(this.#termsR["abs"]);
		return (dep) => Math.abs(this.#parse_expr(match[1])(dep));
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_exp(expr){
		var match = expr.match(this.#termsR["exp"]);
		return (dep) => Math.pow(this.#parse_expr(match[1])(dep),this.#parse_expr(match[2])(dep));
	}
	/**
	* @param {String} expr - Mathematical term to be parsed.
	*/
	#parse_par(expr){
		var match = expr.match(this.#termsR["par"]);
		return (dep) => this.#parse_expr(match[1])(dep);
	}
}
