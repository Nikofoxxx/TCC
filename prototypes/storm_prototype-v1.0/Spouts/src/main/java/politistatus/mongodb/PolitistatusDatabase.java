package politistatus.mongodb;
 
import java.net.UnknownHostException;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

public class PolitistatusDatabase {
	
	private static final PolitistatusDatabase INSTANCE = new PolitistatusDatabase();
	
	private MongoClient mongoClient;
	private DB db;
	private DBCollection collection;
	
	public PolitistatusDatabase(){
	}
	
	public static PolitistatusDatabase getInstance(){
		return INSTANCE;
	}
	
	public void createDBConnection() throws UnknownHostException{
		mongoClient = new MongoClient("localhost");
		db = mongoClient.getDB("database");
        collection = db.getCollection("social_networks_datas");
	}
	
	public void saveInDB(BasicDBObject document) {
		try {
			collection.save(document);
		} catch (Exception ex) {
			System.out.println("Erro ao salvar documento: " + ex.getMessage());
		}
	}
}
