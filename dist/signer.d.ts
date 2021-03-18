declare type Headers = {
    [key: string]: string | null;
};
declare type Request = {
    url: string;
    headers: Headers;
    body: string;
    method: string;
    service?: string;
    region?: string;
};
declare type ServiceInfo = {
    service: string;
    region: string;
};
declare type AccessInfo = {
    access_key: string;
    secret_key: string;
    session_token?: string;
};
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
declare function sign(request: Request, accessInfo: AccessInfo, serviceInfo?: ServiceInfo): Request;
/**
 * AWS request signer.
 * Refer to {@link http://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html|Signature Version 4}
 *
 * @class Signer
 */
declare class Signer {
    static sign: typeof sign;
}
export default Signer;
export { Signer };
