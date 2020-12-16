package valv.hr.connectivity.rfc.importParams.models;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonAutoDetect(setterVisibility = Visibility.NONE, getterVisibility = Visibility.NONE, creatorVisibility = Visibility.NONE, fieldVisibility = Visibility.ANY)
public class NEW_P0210_US {
	
	@JsonProperty
	String PI_PERNR;
	
	@JsonProperty
	String PI_SUBTY = "FED";
	
	@JsonProperty
	Date PI_EFF_DATE;

	public String getPI_PERNR() {
		return PI_PERNR;
	}

	public void setPI_PERNR(String pI_PERNR) {
		PI_PERNR = pI_PERNR;
	}

	public String getPI_SUBTY() {
		return PI_SUBTY;
	}

	public void setPI_SUBTY(String pI_SUBTY) {
		PI_SUBTY = pI_SUBTY;
	}

	public Date getPI_EFF_DATE() {
		return PI_EFF_DATE;
	}

	public void setPI_EFF_DATE(Date pI_EFF_DATE) {
		PI_EFF_DATE = pI_EFF_DATE;
	}
	
}
