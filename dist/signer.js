"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signer = void 0;
const url = __importStar(require("url"));
const AWSGlobal = __importStar(require("aws-sdk/global"));
// @ts-ignore This part of aws-sdk is not typed :-(
const crypto = AWSGlobal.util.crypto;
function encrypt(key, src, encoding = "") {
    return crypto.lib
        .createHmac("sha256", key)
        .update(src, "utf8")
        .digest(encoding);
}
function hash(src) {
    return crypto
        .createHash("sha256")
        .update(src || "", "utf8")
        .digest("hex");
}
/**
* @private
* Create canonical headers
*
<pre>
CanonicalHeaders =
    CanonicalHeadersEntry0 + CanonicalHeadersEntry1 + ... + CanonicalHeadersEntryN
CanonicalHeadersEntry =
    Lowercase(HeaderName) + ':' + Trimall(HeaderValue) + '\n'
</pre>
*/
function canonicalHeaders(headers) {
    if (!headers || Object.keys(headers).length === 0) {
        return "";
    }
    return (Object.keys(headers)
        .map((key) => {
        var _a, _b;
        return ({
            key: key.toLowerCase(),
            value: (_b = (_a = headers === null || headers === void 0 ? void 0 : headers[key]) === null || _a === void 0 ? void 0 : _a.trim().replace(/\s+/g, " ")) !== null && _b !== void 0 ? _b : "",
        });
    })
        .sort((a, b) => a.key < b.key ? -1 : 1)
        .map(({ key, value }) => key + ":" + value)
        .join("\n") + "\n");
}
/**
 * List of header keys included in the canonical headers.
 * @access private
 */
function signedHeaders(headers) {
    return Object.keys(headers)
        .map(function (key) {
        return key.toLowerCase();
    })
        .sort()
        .join(";");
}
/**
* @private
* Create canonical request
* Refer to {@link http://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html|Create a Canonical Request}
*
<pre>
CanonicalRequest =
    HTTPRequestMethod + '\n' +
    CanonicalURI + '\n' +
    CanonicalQueryString + '\n' +
    CanonicalHeaders + '\n' +
    SignedHeaders + '\n' +
    HexEncode(Hash(RequestPayload))
</pre>
*/
function canonicalRequest(request) {
    const url_info = url.parse(request.url);
    return [
        request.method || "/",
        url_info.path,
        url_info.query,
        canonicalHeaders(request.headers),
        signedHeaders(request.headers),
        hash(request.body),
    ].join("\n");
}
function parseServiceInfo(request) {
    const url_info = url.parse(request.url);
    const host = url_info.host;
    const matched = host === null || host === void 0 ? void 0 : host.match(/([^.]+)\.(?:([^.]*)\.)?amazonaws\.com$/);
    let parsed = (matched || []).slice(1, 3);
    if (parsed[1] === "es") {
        // Elastic Search
        parsed = parsed.reverse();
    }
    return {
        service: request.service || parsed[0],
        region: request.region || parsed[1],
    };
}
function credentialScope(dStr, region, service) {
    return [dStr, region, service, "aws4_request"].join("/");
}
/**
* @private
* Create a string to sign
* Refer to {@link http://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html|Create String to Sign}
*
<pre>
StringToSign =
    Algorithm + \n +
    RequestDateTime + \n +
    CredentialScope + \n +
    HashedCanonicalRequest
</pre>
*/
function stringToSign(algorithm, canonical_request, dt_str, scope) {
    return [algorithm, dt_str, scope, hash(canonical_request)].join("\n");
}
/**
* @private
* Create signing key
* Refer to {@link http://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html|Calculate Signature}
*
<pre>
kSecret = your secret access key
kDate = HMAC("AWS4" + kSecret, Date)
kRegion = HMAC(kDate, Region)
kService = HMAC(kRegion, Service)
kSigning = HMAC(kService, "aws4_request")
</pre>
*/
function getSigningKey(secret_key = "", dStr, serviceInfo) {
    const k = "AWS4" + secret_key;
    const kDate = encrypt(k, dStr);
    const kRegion = encrypt(kDate, serviceInfo.region);
    const kService = encrypt(kRegion, serviceInfo.service);
    const kSigning = encrypt(kService, "aws4_request");
    return kSigning;
}
function getSignature(signingKey, string) {
    return encrypt(signingKey, string, "hex");
}
/**
 * @private
 * Create authorization header
 * Refer to {@link http://docs.aws.amazon.com/general/latest/gr/sigv4-add-signature-to-request.html|Add the Signing Information}
 */
function getAuthorizationHeader(algorithm, accessKey, scope, signedHeaders, signature) {
    return [
        `${algorithm} Credential=${accessKey}/${scope}`,
        `SignedHeaders=${signedHeaders}`,
        `Signature=${signature}`,
    ].join(", ");
}
/**
* Sign a HTTP request, add 'Authorization' header to request param
* @method sign
* @memberof Signer
* @static
*
* @param {object} request - HTTP request object
<pre>
request: {
    method: GET | POST | PUT ...
    url: ...,
    headers: {
        header1: ...
    },
    body: data
}
</pre>
* @param {object} access_info - AWS access credential info
<pre>
access_info: {
    access_key: ...,
    secret_key: ...,
    session_token: ...
}
</pre>
* @param {object} [service_info] - AWS service type and region, optional,
*                                  if not provided then parse out from url
<pre>
service_info: {
    service: ...,
    region: ...
}
</pre>
*
* @returns {object} Signed HTTP request
*/
function sign(request, accessInfo, serviceInfo) {
    request.headers = request.headers || {};
    // datetime string and date string
    const dt = new Date();
    const dt_str = dt.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const d_str = dt_str.substr(0, 8);
    const algorithm = "AWS4-HMAC-SHA256";
    const url_info = url.parse(request.url);
    request.headers["host"] = url_info.host;
    request.headers["x-amz-date"] = dt_str;
    if (accessInfo.session_token) {
        request.headers["X-Amz-Security-Token"] = accessInfo.session_token;
    }
    // Task 1: Create a Canonical Request
    const request_str = canonicalRequest(request);
    // Task 2: Create a String to Sign
    serviceInfo = serviceInfo || parseServiceInfo(request);
    const scope = credentialScope(d_str, serviceInfo.region, serviceInfo.service);
    const strToSign = stringToSign(algorithm, request_str, dt_str, scope);
    // Task 3: Calculate the Signature
    const signingKey = getSigningKey(accessInfo.secret_key, d_str, serviceInfo);
    const signature = getSignature(signingKey, strToSign);
    // Task 4: Adding the Signing information to the Request
    const authorizationHeader = getAuthorizationHeader(algorithm, accessInfo.access_key, scope, signedHeaders(request.headers), signature);
    request.headers["Authorization"] = authorizationHeader;
    return request;
}
/**
 * AWS request signer.
 * Refer to {@link http://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html|Signature Version 4}
 *
 * @class Signer
 */
class Signer {
}
exports.Signer = Signer;
Signer.sign = sign;
exports.default = Signer;
