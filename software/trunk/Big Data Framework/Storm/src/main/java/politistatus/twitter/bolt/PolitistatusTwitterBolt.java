package politistatus.twitter.bolt;

import politistatus.mongodb.PolitistatusDatabase;

import com.mongodb.BasicDBObject;

import backtype.storm.topology.BasicOutputCollector;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseBasicBolt;
import backtype.storm.tuple.Tuple;
import twitter4j.Status;

public class PolitistatusTwitterBolt extends BaseBasicBolt {

	private static final PolitistatusTwitterBolt INSTANCE = new PolitistatusTwitterBolt();
	private static final long serialVersionUID = 1L;
	private String[] keywords;
	private BasicDBObject document;

	public PolitistatusTwitterBolt(){
	}
	
	public static PolitistatusTwitterBolt getInstance(){
		return INSTANCE;
	}

	@Override
	public void execute(Tuple tuple, BasicOutputCollector collector) {

		Status status = (Status) tuple.getValueByField("tweet");
		System.out.println(status);
		for (String keyword : PolitistatusTwitterBolt.getInstance().getKeywords()) {
			if(status.getText().contains(keyword)){
				document = new BasicDBObject();
				document.put("tweet_id", status.getId());
				document.put("location", status.getUser().getLocation());
				document.put("date", status.getCreatedAt());
				document.put("keyword", keyword);
				PolitistatusDatabase.getInstance().saveInDB(document);
			}	
		}
	}

	@Override
	public void declareOutputFields(OutputFieldsDeclarer ofd) {
	}

	public String[] getKeywords() {
		return keywords;
	}

	public void setKeywords(String[] keywords) {
		this.keywords = keywords;
	}
}
