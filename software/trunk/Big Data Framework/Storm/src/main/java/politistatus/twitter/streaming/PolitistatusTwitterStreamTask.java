package politistatus.twitter.streaming;

import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Timer;
import java.util.TimerTask;

import backtype.storm.LocalCluster;
import politistatus.mongodb.PolitistatusDatabase;
import politistatus.twitter.bolt.PolitistatusTwitterBolt;

public class PolitistatusTwitterStreamTask extends TimerTask{

	private String consumerKey;
	private String consumerSecret;
	private String accessToken;
	private String accessTokenSecret;
	private LocalCluster cluster;
	private Timer timer;
	
	public PolitistatusTwitterStreamTask(String consumerKey,
			String consumerSecret, String accessToken,
			String accessTokenSecret, LocalCluster cluster, Timer timer) {
		
		this.consumerKey = consumerKey;
		this.consumerSecret = consumerSecret;
		this.accessToken = accessToken;
		this.accessTokenSecret = accessTokenSecret;
		this.cluster = cluster;
		this.timer = timer;
	}

	@Override
	public void run() {
		String[] queriedKeyWords = checkIfHasNewUsersKeywords(PolitistatusTwitterBolt.getInstance().getKeywords()); 
		if(queriedKeyWords != null){
			try {
				timer.cancel();
				PolitistatusTwitterBolt.getInstance().setKeywords(queriedKeyWords);
				cluster.shutdown();
				PolitistatusTwitterStream.buildTopology(consumerKey, consumerSecret, 
						accessToken, accessTokenSecret, PolitistatusTwitterBolt.getInstance().getKeywords());
			} catch (UnknownHostException e) {
				System.out.println("Erro ao criar a nova topologia: " + e.getMessage());
			}
		};
	}
	
	private static String[] checkIfHasNewUsersKeywords(String[] keyWords){
		String[] queriedKeyWords = PolitistatusDatabase.getInstance().getAllUserKeywords();
		return Arrays.equals(keyWords, queriedKeyWords) ? null : queriedKeyWords;
	}
}
