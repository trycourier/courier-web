import { ClientAction, ServerResponse, ServerResponseEnvelope } from "../types/socket/protocol/v1/messages";
import { TransactionManager } from "../socket/courier-inbox-transaction-manager";

const TRANSACTION_ID = '123';

jest.useFakeTimers();

describe('TransactionManager', () => {
  it('should add an outstanding request', () => {
    const transactionManager = new TransactionManager();
    transactionManager.addOutstandingRequest(TRANSACTION_ID, {
      tid: TRANSACTION_ID,
      action: ClientAction.Subscribe,
    });

    expect(transactionManager.outstandingRequests).toHaveLength(1);
    expect(transactionManager.outstandingRequests[0].transactionId).toBe(TRANSACTION_ID);
    expect(transactionManager.outstandingRequests[0].request.action).toBe(ClientAction.Subscribe);
  });

  it('should add a response to an outstanding request and record times', () => {
    const transactionManager = new TransactionManager();
    transactionManager.addOutstandingRequest(TRANSACTION_ID, {
      tid: TRANSACTION_ID,
      action: ClientAction.Subscribe,
    });

    // Advance mock timer by 1 second.
    jest.advanceTimersByTime(1000);

    transactionManager.addResponse(TRANSACTION_ID, {
      tid: TRANSACTION_ID,
      response: ServerResponse.Ack,
    });

    expect(transactionManager.outstandingRequests).toHaveLength(0);
    expect(transactionManager.completedTransactions).toHaveLength(1);

    const completedRequest = transactionManager.completedTransactions[0];
    expect(completedRequest.transactionId).toBe(TRANSACTION_ID);
    expect(completedRequest.request.action).toBe(ClientAction.Subscribe);

    const response = completedRequest.response as ServerResponseEnvelope;
    expect(response.response).toBe(ServerResponse.Ack);

    // Validate 1 second passed between start and end.
    expect(completedRequest.start).toBeDefined();
    expect(completedRequest.end).toBeDefined();
    expect(completedRequest.end!.getTime() - completedRequest.start.getTime()).toBe(1000);
  });

  it('should throw an error if a response is added to a non-existent request', () => {
    const transactionManager = new TransactionManager();
    expect(() => {
      transactionManager.addResponse(TRANSACTION_ID, {
        tid: TRANSACTION_ID,
        response: ServerResponse.Ack,
      });
    }).toThrow(`Transaction [${TRANSACTION_ID}] does not have an outstanding request`);
  });

  it('should throw an error if an outstanding request is added twice', () => {
    const transactionManager = new TransactionManager();
    transactionManager.addOutstandingRequest(TRANSACTION_ID, {
      tid: TRANSACTION_ID,
      action: ClientAction.Subscribe,
    });

    expect(() => {
      transactionManager.addOutstandingRequest(TRANSACTION_ID, {
        tid: TRANSACTION_ID,
        action: ClientAction.Subscribe,
      });
    }).toThrow(`Transaction [${TRANSACTION_ID}] already has an outstanding request`);
  });

  it('should clear outstanding requests', () => {
    const transactionManager = new TransactionManager();
    transactionManager.addOutstandingRequest(TRANSACTION_ID, {
      tid: TRANSACTION_ID,
      action: ClientAction.Subscribe,
    });

    transactionManager.clearOutstandingRequests();

    expect(transactionManager.outstandingRequests).toHaveLength(0);
  });

  it('should keep the last N completed transactions', () => {
    const transactionManager = new TransactionManager(2);
    transactionManager.addOutstandingRequest(TRANSACTION_ID, {
      tid: TRANSACTION_ID,
      action: ClientAction.Subscribe,
    });

    transactionManager.addResponse(TRANSACTION_ID, {
      tid: TRANSACTION_ID,
      response: ServerResponse.Ack,
    });

    transactionManager.addOutstandingRequest("id-2", {
      tid: "id-2",
      action: ClientAction.Subscribe,
    });

    transactionManager.addResponse("id-2", {
      tid: "id-2",
      response: ServerResponse.Ack,
    });

    transactionManager.addOutstandingRequest("id-3", {
      tid: "id-3",
      action: ClientAction.Subscribe,
    });

    transactionManager.addResponse("id-3", {
      tid: "id-3",
      response: ServerResponse.Ack,
    });

    expect(transactionManager.completedTransactions).toHaveLength(2);
  });
});