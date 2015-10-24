package politistatus.mongodb;
 
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Set;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.MongoClient;

public class PolitistatusDatabase {
	
	private static final PolitistatusDatabase INSTANCE = new PolitistatusDatabase();
	
	private MongoClient mongoClient;
	private DB db;
	private DBCollection social_networks_collection;
	private DBCollection users_collection;
	private Set<String> cleanedKeywords;
	private String[] keywordsToDataMining;
	
	public PolitistatusDatabase(){
	}
	
	public static PolitistatusDatabase getInstance(){
		return INSTANCE;
	}
	
	public void createDBConnection() throws UnknownHostException{
		mongoClient = new MongoClient("localhost");
		db = mongoClient.getDB("database");
        social_networks_collection = db.getCollection("social_networks_datas");
        users_collection = db.getCollection("users");
	}
	
	public String[] getAllUserKeywords(){
		DBCursor cursor = users_collection.find();
		BasicDBList dbKeywords = new BasicDBList();
		ArrayList<String> keywordsList = new ArrayList<String>();
		
		while (cursor.hasNext()) {
			dbKeywords = (BasicDBList) (cursor.next().get("user_keywords"));
			
			for (Object dbOject : dbKeywords) {
				keywordsList.add((String)dbOject);
			}
		}
		
		cleanedKeywords = new LinkedHashSet<String>(keywordsList);
		
		keywordsToDataMining = new String[cleanedKeywords.size()];
		keywordsToDataMining = cleanedKeywords.toArray(keywordsToDataMining);	
		
		return keywordsToDataMining;
	}
	
	public void saveInDB(BasicDBObject document) {
		try {
			social_networks_collection.save(document);
		} catch (Exception ex) {
			System.out.println("Erro ao salvar documento: " + ex.getMessage());
		}
	}
}
