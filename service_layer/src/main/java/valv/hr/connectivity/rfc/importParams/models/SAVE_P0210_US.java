package valv.hr.connectivity.rfc.importParams.models;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

import valv.hr.connectivity.rfc.structures.PI_RECORD;

@JsonAutoDetect(setterVisibility = Visibility.NONE, getterVisibility = Visibility.NONE, creatorVisibility = Visibility.NONE, fieldVisibility = Visibility.ANY)
public class SAVE_P0210_US {

	@JsonProperty
	PI_RECORD OLD_RECORD;
	
	@JsonProperty
	PI_RECORD NEW_RECORD;

	public PI_RECORD getOLD_RECORD() {
		return OLD_RECORD;
	}

	public void setOLD_RECORD(PI_RECORD oLD_RECORD) {
		OLD_RECORD = oLD_RECORD;
	}

	public PI_RECORD getNEW_RECORD() {
		return NEW_RECORD;
	}

	public void setNEW_RECORD(PI_RECORD nEW_RECORD) {
		NEW_RECORD = nEW_RECORD;
	}
	
	
}
