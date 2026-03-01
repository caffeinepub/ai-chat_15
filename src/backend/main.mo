import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type Role = { #user; #assistant };

  type Message = {
    id : Nat;
    role : Role;
    content : Text;
    timestamp : Time.Time;
  };

  module Message {
    public func compare(msg1 : Message, msg2 : Message) : Order.Order {
      Nat.compare(msg1.id, msg2.id);
    };

    public func compareByTimestamp(msg1 : Message, msg2 : Message) : Order.Order {
      Int.compare(msg1.timestamp, msg2.timestamp);
    };
  };

  type Conversation = {
    id : Nat;
    title : Text;
    messages : [Message];
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module Conversation {
    public func compareByTitle(conv1 : Conversation, conv2 : Conversation) : Order.Order {
      Text.compare(conv1.title, conv2.title);
    };
  };

  type ConversationSummary = {
    id : Nat;
    title : Text;
    messageCount : Nat;
    lastUpdated : Time.Time;
  };

  var nextConversationId = 0;
  var nextMessageId = 0;

  let conversations = Map.empty<Nat, Conversation>();

  public shared ({ caller }) func createConversation(title : Text) : async Nat {
    let now = Time.now();
    let conversation : Conversation = {
      id = nextConversationId;
      title;
      messages = [];
      createdAt = now;
      updatedAt = now;
    };
    conversations.add(nextConversationId, conversation);
    nextConversationId += 1;
    conversation.id;
  };

  public query ({ caller }) func listConversations() : async [ConversationSummary] {
    conversations.values().toArray().map(
      func(conv) {
        {
          id = conv.id;
          title = conv.title;
          messageCount = conv.messages.size();
          lastUpdated = conv.updatedAt;
        };
      }
    );
  };

  public query ({ caller }) func getConversation(id : Nat) : async ?Conversation {
    conversations.get(id);
  };

  public shared ({ caller }) func addMessage(conversationId : Nat, role : Role, content : Text) : async () {
    let conversation = switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation does not exist") };
      case (?conv) { conv };
    };

    let message : Message = {
      id = nextMessageId;
      role;
      content;
      timestamp = Time.now();
    };
    nextMessageId += 1;

    let newMessages = conversation.messages.concat([message]);
    let updatedConversation : Conversation = {
      id = conversation.id;
      title = conversation.title;
      messages = newMessages;
      createdAt = conversation.createdAt;
      updatedAt = Time.now();
    };

    conversations.add(conversationId, updatedConversation);
  };

  public shared ({ caller }) func deleteConversation(id : Nat) : async () {
    if (not conversations.containsKey(id)) {
      Runtime.trap("Conversation does not exist");
    };
    conversations.remove(id);
  };

  public shared ({ caller }) func updateConversationTitle(id : Nat, newTitle : Text) : async () {
    let conversation = switch (conversations.get(id)) {
      case (null) { Runtime.trap("Conversation does not exist") };
      case (?conv) { conv };
    };

    let updatedConversation : Conversation = {
      id = conversation.id;
      title = newTitle;
      messages = conversation.messages;
      createdAt = conversation.createdAt;
      updatedAt = Time.now();
    };

    conversations.add(id, updatedConversation);
  };
};
