package valv.hr.connectivity.rfc.importParams.models;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

import valv.hr.connectivity.rfc.structures.PI_RECORD;

@JsonAutoDetect(setterVisibility = Visibility.NONE, getterVisibility = Visibility.NONE, creatorVisibility = Visibility.NONE, fieldVisibility = Visibility.ANY)
public class EDIT_P0210_US {
	
	@JsonProperty
	PI_RECORD PI_RECORD;

	public PI_RECORD getPI_RECORD() {
		return PI_RECORD;
	}

	public void setPI_RECORD(PI_RECORD pI_RECORD) {
		PI_RECORD = pI_RECORD;
	}
	
}
