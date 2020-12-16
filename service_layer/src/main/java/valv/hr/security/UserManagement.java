package valv.hr.security;

import java.util.Base64;
import java.util.Base64.Decoder;

import org.json.JSONException;
import org.json.JSONObject;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;

public class UserManagement {
	
	public HRUser getUserCreds(String userToken) throws JSONException{
		JSONObject userAtr = this.getUserAttributes(userToken);
		JSONObject xsAttr = userAtr.getJSONObject("xs.user.attributes");
		HRUser user = new HRUser();
		user.setFirstName(xsAttr.getJSONArray("givenName").getString(0));
		user.setLastName(xsAttr.getJSONArray("lastName").getString(0));
		user.setFrID(xsAttr.getJSONArray("frID").getString(0));
		user.setUserId(xsAttr.getJSONArray("UserName").getString(0));
		return user;
	}
	
	private JSONObject getUserAttributes(String tokenValue) {
		DecodedJWT jwt = JWT.decode(tokenValue);
		String payload = jwt.getPayload();
		Decoder decoder = Base64.getDecoder();
		String tokenVal = new String(decoder.decode(payload));
		JSONObject tokenObj = new JSONObject(tokenVal);
		return tokenObj;
	}

}
