package valv.hr.connectivity.rfc.structures;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonAutoDetect(setterVisibility = Visibility.NONE, getterVisibility = Visibility.NONE, creatorVisibility = Visibility.NONE, fieldVisibility = Visibility.ANY)
public class F4VALUE {

	@JsonProperty
	String VALUEKEY;
	
	@JsonProperty
	String VALUETEXT;

	public String getVALUEKEY() {
		return VALUEKEY;
	}

	public void setVALUEKEY(String vALUEKEY) {
		VALUEKEY = vALUEKEY;
	}

	public String getVALUETEXT() {
		return VALUETEXT;
	}

	public void setVALUETEXT(String vALUETEXT) {
		VALUETEXT = vALUETEXT;
	}
	
	
}
