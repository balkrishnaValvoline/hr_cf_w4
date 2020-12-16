package valv.hr.connectivity.rfc.importParams.models;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonAutoDetect(setterVisibility = Visibility.NONE, getterVisibility = Visibility.NONE, creatorVisibility = Visibility.NONE, fieldVisibility = Visibility.ANY)
public class READ_P0210_US {
	
	@JsonProperty
	String PI_SUBTY = "FED";
	
	@JsonProperty
	String PI_EMP_LID;
	
	@JsonProperty
	Date PI_EFF_DATE;

	public String getPI_SUBTY() {
		return PI_SUBTY;
	}

	public void setPI_SUBTY(String pI_SUBTY) {
		PI_SUBTY = pI_SUBTY;
	}

	public String getPI_EMP_LID() {
		return PI_EMP_LID;
	}

	public void setPI_EMP_LID(String pI_EMP_LID) {
		PI_EMP_LID = pI_EMP_LID;
	}

	public Date getPI_EFF_DATE() {
		return PI_EFF_DATE;
	}

	public void setPI_EFF_DATE(Date pI_EFF_DATE) {
		PI_EFF_DATE = pI_EFF_DATE;
	}
	

}
