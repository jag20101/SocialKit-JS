/*
 * Crypto-JS v2.4.0
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2011, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
if (typeof Crypto == "undefined" || !Crypto.util)
	(function() {
		var n = window.Crypto = {}, q = n.util = {
			rotl : function(f, j) {
				return f << j | f >>> 32 - j
			},
			rotr : function(f, j) {
				return f << 32 - j | f >>> j
			},
			endian : function(f) {
				if (f.constructor == Number)
					return q.rotl(f, 8) & 16711935 | q.rotl(f, 24) & 4278255360;
				for ( var j = 0; j < f.length; j++)
					f[j] = q.endian(f[j]);
				return f
			},
			randomBytes : function(f) {
				for ( var j = []; f > 0; f--)
					j.push(Math.floor(Math.random() * 256));
				return j
			},
			bytesToWords : function(f) {
				for ( var j = [], b = 0, a = 0; b < f.length; b++, a += 8)
					j[a >>> 5] |= f[b] << 24 - a % 32;
				return j
			},
			wordsToBytes : function(f) {
				for ( var j = [], b = 0; b < f.length * 32; b += 8)
					j.push(f[b >>> 5] >>> 24 - b % 32 & 255);
				return j
			},
			bytesToHex : function(f) {
				for ( var j = [], b = 0; b < f.length; b++) {
					j.push((f[b] >>> 4).toString(16));
					j.push((f[b] & 15).toString(16))
				}
				return j.join("")
			},
			hexToBytes : function(f) {
				for ( var j = [], b = 0; b < f.length; b += 2)
					j.push(parseInt(f.substr(b, 2), 16));
				return j
			},
			bytesToBase64 : function(f) {
				if (typeof btoa == "function")
					return btoa(p.bytesToString(f));
				for ( var j = [], b = 0; b < f.length; b += 3)
					for ( var a = f[b] << 16 | f[b + 1] << 8 | f[b + 2], e = 0; e < 4; e++)
						b * 8 + e * 6 <= f.length * 8 ? j
								.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
										.charAt(a >>> 6 * (3 - e) & 63))
								: j.push("=");
				return j.join("")
			},
			base64ToBytes : function(f) {
				if (typeof atob == "function")
					return p.stringToBytes(atob(f));
				f = f.replace(/[^A-Z0-9+\/]/ig, "");
				for ( var j = [], b = 0, a = 0; b < f.length; a = ++b % 4)
					a != 0
							&& j
									.push(("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
											.indexOf(f.charAt(b - 1)) & Math
											.pow(2, -2 * a + 8) - 1) << a * 2
											| "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
													.indexOf(f.charAt(b)) >>> 6 - a * 2);
				return j
			}
		};
		n = n.charenc = {};
		n.UTF8 = {
			stringToBytes : function(f) {
				return p.stringToBytes(unescape(encodeURIComponent(f)))
			},
			bytesToString : function(f) {
				return decodeURIComponent(escape(p.bytesToString(f)))
			}
		};
		var p = n.Binary = {
			stringToBytes : function(f) {
				for ( var j = [], b = 0; b < f.length; b++)
					j.push(f.charCodeAt(b) & 255);
				return j
			},
			bytesToString : function(f) {
				for ( var j = [], b = 0; b < f.length; b++)
					j.push(String.fromCharCode(f[b]));
				return j.join("")
			}
		}
	})();
(function() {
	var n = Crypto, q = n.util, p = n.charenc, f = p.UTF8, j = p.Binary, b = n.SHA1 = function(
			a, e) {
		var g = q.wordsToBytes(b._sha1(a));
		return e && e.asBytes ? g : e && e.asString ? j.bytesToString(g) : q
				.bytesToHex(g)
	};
	b._sha1 = function(a) {
		if (a.constructor == String)
			a = f.stringToBytes(a);
		var e = q.bytesToWords(a), g = a.length * 8;
		a = [];
		var k = 1732584193, l = -271733879, o = -1732584194, r = 271733878, x = -1009589776;
		e[g >> 5] |= 128 << 24 - g % 32;
		e[(g + 64 >>> 9 << 4) + 15] = g;
		for (g = 0; g < e.length; g += 16) {
			for ( var i = k, t = l, w = o, s = r, u = x, h = 0; h < 80; h++) {
				if (h < 16)
					a[h] = e[g + h];
				else {
					var m = a[h - 3] ^ a[h - 8] ^ a[h - 14] ^ a[h - 16];
					a[h] = m << 1 | m >>> 31
				}
				m = (k << 5 | k >>> 27)
						+ x
						+ (a[h] >>> 0)
						+ (h < 20 ? (l & o | ~l & r) + 1518500249 : h < 40 ? (l
								^ o ^ r) + 1859775393
								: h < 60 ? (l & o | l & r | o & r) - 1894007588
										: (l ^ o ^ r) - 899497514);
				x = r;
				r = o;
				o = l << 30 | l >>> 2;
				l = k;
				k = m
			}
			k += i;
			l += t;
			o += w;
			r += s;
			x += u
		}
		return [ k, l, o, r, x ]
	};
	b._blocksize = 16;
	b._digestsize = 20
})();
(function() {
	var n = Crypto, q = n.util, p = n.charenc, f = p.UTF8, j = p.Binary;
	n.HMAC = function(b, a, e, g) {
		if (a.constructor == String)
			a = f.stringToBytes(a);
		if (e.constructor == String)
			e = f.stringToBytes(e);
		if (e.length > b._blocksize * 4)
			e = b(e, {
				asBytes : true
			});
		var k = e.slice(0);
		e = e.slice(0);
		for ( var l = 0; l < b._blocksize * 4; l++) {
			k[l] ^= 92;
			e[l] ^= 54
		}
		b = b(k.concat(b(e.concat(a), {
			asBytes : true
		})), {
			asBytes : true
		});
		return g && g.asBytes ? b : g && g.asString ? j.bytesToString(b) : q
				.bytesToHex(b)
	}
})();
(function() {
	var n = Crypto, q = n.util, p = n.charenc, f = p.UTF8, j = p.Binary;
	n.PBKDF2 = function(b, a, e, g) {
		function k(u, h) {
			return n.HMAC(l, h, u, {
				asBytes : true
			})
		}
		if (b.constructor == String)
			b = f.stringToBytes(b);
		if (a.constructor == String)
			a = f.stringToBytes(a);
		for ( var l = g && g.hasher || n.SHA1, o = g && g.iterations || 1, r = [], x = 1; r.length < e;) {
			for ( var i = k(b, a.concat(q.wordsToBytes([ x ]))), t = i, w = 1; w < o; w++) {
				t = k(b, t);
				for ( var s = 0; s < i.length; s++)
					i[s] ^= t[s]
			}
			r = r.concat(i);
			x++
		}
		r.length = e;
		return g && g.asBytes ? r : g && g.asString ? j.bytesToString(r) : q
				.bytesToHex(r)
	}
})();
(function(n) {
	function q(b, a) {
		var e = b._blocksize * 4;
		return e - a.length % e
	}
	var p = n.pad = {}, f = function(b) {
		for ( var a = b.pop(), e = 1; e < a; e++)
			b.pop()
	};
	p.NoPadding = {
		pad : function() {
		},
		unpad : function() {
		}
	};
	p.ZeroPadding = {
		pad : function(b, a) {
			var e = b._blocksize * 4, g = a.length % e;
			if (g != 0)
				for (g = e - g; g > 0; g--)
					a.push(0)
		},
		unpad : function() {
		}
	};
	p.iso7816 = {
		pad : function(b, a) {
			var e = q(b, a);
			for (a.push(128); e > 1; e--)
				a.push(0)
		},
		unpad : function(b) {
			for (; b.pop() != 128;)
				;
		}
	};
	p.ansix923 = {
		pad : function(b, a) {
			for ( var e = q(b, a), g = 1; g < e; g++)
				a.push(0);
			a.push(e)
		},
		unpad : f
	};
	p.iso10126 = {
		pad : function(b, a) {
			for ( var e = q(b, a), g = 1; g < e; g++)
				a.push(Math.floor(Math.random() * 256));
			a.push(e)
		},
		unpad : f
	};
	p.pkcs7 = {
		pad : function(b, a) {
			for ( var e = q(b, a), g = 0; g < e; g++)
				a.push(e)
		},
		unpad : f
	};
	n = n.mode = {};
	var j = n.Mode = function(b) {
		if (b)
			this._padding = b
	};
	j.prototype = {
		encrypt : function(b, a, e) {
			this._padding.pad(b, a);
			this._doEncrypt(b, a, e)
		},
		decrypt : function(b, a, e) {
			this._doDecrypt(b, a, e);
			this._padding.unpad(a)
		},
		_padding : p.iso7816
	};
	f = (n.ECB = function() {
		j.apply(this, arguments)
	}).prototype = new j;
	f._doEncrypt = function(b, a) {
		for ( var e = b._blocksize * 4, g = 0; g < a.length; g += e)
			b._encryptblock(a, g)
	};
	f._doDecrypt = function(b, a) {
		for ( var e = b._blocksize * 4, g = 0; g < a.length; g += e)
			b._decryptblock(a, g)
	};
	f.fixOptions = function(b) {
		b.iv = []
	};
	f = (n.CBC = function() {
		j.apply(this, arguments)
	}).prototype = new j;
	f._doEncrypt = function(b, a, e) {
		for ( var g = b._blocksize * 4, k = 0; k < a.length; k += g) {
			if (k == 0)
				for ( var l = 0; l < g; l++)
					a[l] ^= e[l];
			else
				for (l = 0; l < g; l++)
					a[k + l] ^= a[k + l - g];
			b._encryptblock(a, k)
		}
	};
	f._doDecrypt = function(b, a, e) {
		for ( var g = b._blocksize * 4, k = 0; k < a.length; k += g) {
			var l = a.slice(k, k + g);
			b._decryptblock(a, k);
			for ( var o = 0; o < g; o++)
				a[k + o] ^= e[o];
			e = l
		}
	};
	f = (n.CFB = function() {
		j.apply(this, arguments)
	}).prototype = new j;
	f._padding = p.NoPadding;
	f._doEncrypt = function(b, a, e) {
		var g = b._blocksize * 4;
		e = e.slice(0);
		for ( var k = 0; k < a.length; k++) {
			var l = k % g;
			l == 0 && b._encryptblock(e, 0);
			a[k] ^= e[l];
			e[l] = a[k]
		}
	};
	f._doDecrypt = function(b, a, e) {
		var g = b._blocksize * 4;
		e = e.slice(0);
		for ( var k = 0; k < a.length; k++) {
			var l = k % g;
			l == 0 && b._encryptblock(e, 0);
			var o = a[k];
			a[k] ^= e[l];
			e[l] = o
		}
	};
	f = (n.OFB = function() {
		j.apply(this, arguments)
	}).prototype = new j;
	f._padding = p.NoPadding;
	f._doEncrypt = function(b, a, e) {
		var g = b._blocksize * 4;
		e = e.slice(0);
		for ( var k = 0; k < a.length; k++) {
			k % g == 0 && b._encryptblock(e, 0);
			a[k] ^= e[k % g]
		}
	};
	f._doDecrypt = f._doEncrypt;
	n = (n.CTR = function() {
		j.apply(this, arguments)
	}).prototype = new j;
	n._padding = p.NoPadding;
	n._doEncrypt = function(b, a, e) {
		for ( var g = b._blocksize * 4, k = 0; k < a.length;) {
			var l = e.slice(0);
			b._encryptblock(l, 0);
			for ( var o = 0; k < a.length && o < g; o++, k++)
				a[k] ^= l[o];
			if (++e[g - 1] == 256) {
				e[g - 1] = 0;
				if (++e[g - 2] == 256) {
					e[g - 2] = 0;
					if (++e[g - 3] == 256) {
						e[g - 3] = 0;
						++e[g - 4]
					}
				}
			}
		}
	};
	n._doDecrypt = n._doEncrypt
})(Crypto);
(function() {
	function n(h, m) {
		for ( var d = 0, c = 0; c < 8; c++) {
			if (m & 1)
				d ^= h;
			var v = h & 128;
			h = h << 1 & 255;
			if (v)
				h ^= 27;
			m >>>= 1
		}
		return d
	}
	for ( var q = Crypto, p = q.util, f = q.charenc.UTF8, j = [ 99, 124, 119,
			123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202,
			130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114,
			192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113,
			216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226,
			235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214,
			179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203,
			190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69,
			249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245,
			188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151,
			68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34,
			42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10,
			73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55,
			109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186,
			120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139,
			138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193,
			29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233,
			206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153,
			45, 15, 176, 84, 187, 22 ], b = [], a = 0; a < 256; a++)
		b[j[a]] = a;
	var e = [], g = [], k = [], l = [], o = [], r = [];
	for (a = 0; a < 256; a++) {
		e[a] = n(a, 2);
		g[a] = n(a, 3);
		k[a] = n(a, 9);
		l[a] = n(a, 11);
		o[a] = n(a, 13);
		r[a] = n(a, 14)
	}
	var x = [ 0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54 ], i = [ [], [], [], [] ], t, w, s, u = q.AES = {
		encrypt : function(h, m, d) {
			d = d || {};
			var c = d.mode || new q.mode.OFB;
			c.fixOptions && c.fixOptions(d);
			h = h.constructor == String ? f.stringToBytes(h) : h;
			var v = d.iv || p.randomBytes(u._blocksize * 4);
			m = m.constructor == String ? q.PBKDF2(m, v, 32, {
				asBytes : true
			}) : m;
			u._init(m);
			c.encrypt(u, h, v);
			h = d.iv ? h : v.concat(h);
			return d && d.asBytes ? h : p.bytesToBase64(h)
		},
		decrypt : function(h, m, d) {
			d = d || {};
			var c = d.mode || new q.mode.OFB;
			c.fixOptions && c.fixOptions(d);
			h = h.constructor == String ? p.base64ToBytes(h) : h;
			var v = d.iv || h.splice(0, u._blocksize * 4);
			m = m.constructor == String ? q.PBKDF2(m, v, 32, {
				asBytes : true
			}) : m;
			u._init(m);
			c.decrypt(u, h, v);
			return d && d.asBytes ? h : f.bytesToString(h)
		},
		_blocksize : 4,
		_encryptblock : function(h, m) {
			for ( var d = 0; d < u._blocksize; d++)
				for ( var c = 0; c < 4; c++)
					i[d][c] = h[m + c * 4 + d];
			for (d = 0; d < 4; d++)
				for (c = 0; c < 4; c++)
					i[d][c] ^= s[c][d];
			for ( var v = 1; v < w; v++) {
				for (d = 0; d < 4; d++)
					for (c = 0; c < 4; c++)
						i[d][c] = j[i[d][c]];
				i[1].push(i[1].shift());
				i[2].push(i[2].shift());
				i[2].push(i[2].shift());
				i[3].unshift(i[3].pop());
				for (c = 0; c < 4; c++) {
					d = i[0][c];
					var y = i[1][c], z = i[2][c], A = i[3][c];
					i[0][c] = e[d] ^ g[y] ^ z ^ A;
					i[1][c] = d ^ e[y] ^ g[z] ^ A;
					i[2][c] = d ^ y ^ e[z] ^ g[A];
					i[3][c] = g[d] ^ y ^ z ^ e[A]
				}
				for (d = 0; d < 4; d++)
					for (c = 0; c < 4; c++)
						i[d][c] ^= s[v * 4 + c][d]
			}
			for (d = 0; d < 4; d++)
				for (c = 0; c < 4; c++)
					i[d][c] = j[i[d][c]];
			i[1].push(i[1].shift());
			i[2].push(i[2].shift());
			i[2].push(i[2].shift());
			i[3].unshift(i[3].pop());
			for (d = 0; d < 4; d++)
				for (c = 0; c < 4; c++)
					i[d][c] ^= s[w * 4 + c][d];
			for (d = 0; d < u._blocksize; d++)
				for (c = 0; c < 4; c++)
					h[m + c * 4 + d] = i[d][c]
		},
		_decryptblock : function(h, m) {
			for ( var d = 0; d < u._blocksize; d++)
				for ( var c = 0; c < 4; c++)
					i[d][c] = h[m + c * 4 + d];
			for (d = 0; d < 4; d++)
				for (c = 0; c < 4; c++)
					i[d][c] ^= s[w * 4 + c][d];
			for ( var v = 1; v < w; v++) {
				i[1].unshift(i[1].pop());
				i[2].push(i[2].shift());
				i[2].push(i[2].shift());
				i[3].push(i[3].shift());
				for (d = 0; d < 4; d++)
					for (c = 0; c < 4; c++)
						i[d][c] = b[i[d][c]];
				for (d = 0; d < 4; d++)
					for (c = 0; c < 4; c++)
						i[d][c] ^= s[(w - v) * 4 + c][d];
				for (c = 0; c < 4; c++) {
					d = i[0][c];
					var y = i[1][c], z = i[2][c], A = i[3][c];
					i[0][c] = r[d] ^ l[y] ^ o[z] ^ k[A];
					i[1][c] = k[d] ^ r[y] ^ l[z] ^ o[A];
					i[2][c] = o[d] ^ k[y] ^ r[z] ^ l[A];
					i[3][c] = l[d] ^ o[y] ^ k[z] ^ r[A]
				}
			}
			i[1].unshift(i[1].pop());
			i[2].push(i[2].shift());
			i[2].push(i[2].shift());
			i[3].push(i[3].shift());
			for (d = 0; d < 4; d++)
				for (c = 0; c < 4; c++)
					i[d][c] = b[i[d][c]];
			for (d = 0; d < 4; d++)
				for (c = 0; c < 4; c++)
					i[d][c] ^= s[c][d];
			for (d = 0; d < u._blocksize; d++)
				for (c = 0; c < 4; c++)
					h[m + c * 4 + d] = i[d][c]
		},
		_init : function(h) {
			t = h.length / 4;
			w = t + 6;
			u._keyexpansion(h)
		},
		_keyexpansion : function(h) {
			s = [];
			for ( var m = 0; m < t; m++)
				s[m] = [ h[m * 4], h[m * 4 + 1], h[m * 4 + 2], h[m * 4 + 3] ];
			for (m = t; m < u._blocksize * (w + 1); m++) {
				h = [ s[m - 1][0], s[m - 1][1], s[m - 1][2], s[m - 1][3] ];
				if (m % t == 0) {
					h.push(h.shift());
					h[0] = j[h[0]];
					h[1] = j[h[1]];
					h[2] = j[h[2]];
					h[3] = j[h[3]];
					h[0] ^= x[m / t]
				} else if (t > 6 && m % t == 4) {
					h[0] = j[h[0]];
					h[1] = j[h[1]];
					h[2] = j[h[2]];
					h[3] = j[h[3]]
				}
				s[m] = [ s[m - t][0] ^ h[0], s[m - t][1] ^ h[1],
						s[m - t][2] ^ h[2], s[m - t][3] ^ h[3] ]
			}
		}
	}
})();
