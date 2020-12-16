package valv.hr.utility;

import java.util.List;

import valv.hr.connectivity.rfc.structures.PO_MESSAGES;

/**
 * Java object for PO_MESSAGES along with flag for Error Message indication
 * @author Balkrishna.Meena
 *
 */
public class MESSAGE_PROCESS_OBJ {
	
	List<PO_MESSAGES> poMessages;
	
	boolean errorFlag = false;

	public List<PO_MESSAGES> getPoMessages() {
		return poMessages;
	}

	public void setPoMessages(List<PO_MESSAGES> poMessages) {
		this.poMessages = poMessages;
	}

	public boolean isErrorFlag() {
		return errorFlag;
	}

	public void setErrorFlag(boolean errorFlag) {
		this.errorFlag = errorFlag;
	}

}
