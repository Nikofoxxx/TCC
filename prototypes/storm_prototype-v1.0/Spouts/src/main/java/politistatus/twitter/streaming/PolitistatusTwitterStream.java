package politistatus.twitter.streaming;

import java.net.UnknownHostException;
import java.util.Timer;

import politistatus.mongodb.PolitistatusDatabase;
import politistatus.twitter.bolt.PolitistatusTwitterBolt;
import politistatus.twitter.streaming.PolitistatusTwitterSpout;
import backtype.storm.Config;
import backtype.storm.LocalCluster;
import backtype.storm.topology.TopologyBuilder;
import backtype.storm.utils.Utils;

public class PolitistatusTwitterStream {

	public static void main(String[] args) throws UnknownHostException {

		String consumerKey = args[0];
		String consumerSecret = args[1];
		String accessToken = args[2];
		String accessTokenSecret = args[3];
		String[] keyWords;

		openDbConnection();

		keyWords = getAllUserKeywords();

		if (keyWords != null) {
			
			PolitistatusTwitterBolt.getInstance().setKeywords(keyWords);
			
			buildTopology(consumerKey, consumerSecret, accessToken,
					accessTokenSecret, keyWords);
			
		} else {
			System.out.println("Não existem políticos cadastrados no banco de dados!");
		}

	}

	private static void openDbConnection() {
		try {
			PolitistatusDatabase.getInstance().createDBConnection();
		} catch (UnknownHostException ex) {
			System.out.println("Erro ao conectar ao banco de dados: " +  ex.getMessage());
		}
	}

	private static String[] getAllUserKeywords() {
		try {
			return PolitistatusDatabase.getInstance().getAllUserKeywords();
		} catch (Exception ex) {
			System.out.println("Erro ao buscar todos os dados: " + ex.getMessage());
		}
		return null;
	}

	static void buildTopology(String consumerKey,
			String consumerSecret, String accessToken,
			String accessTokenSecret, String[] keyWords)
			throws UnknownHostException {

		TopologyBuilder builder = new TopologyBuilder();

		builder.setSpout("twitter", new PolitistatusTwitterSpout(consumerKey,
				consumerSecret, accessToken, accessTokenSecret, keyWords));
		builder.setBolt("print", new PolitistatusTwitterBolt())
				.shuffleGrouping("twitter");

		Config conf = new Config();

		final LocalCluster cluster = new LocalCluster();

		cluster.submitTopology("Politistatus-topology", conf,
				builder.createTopology());

		Utils.sleep(10000);
		
		Timer timer = new Timer();
		timer.scheduleAtFixedRate(new PolitistatusTwitterStreamTask(consumerKey,
				consumerSecret, accessToken,accessTokenSecret, cluster, timer) { }, 0, 5000);	
	}
}
