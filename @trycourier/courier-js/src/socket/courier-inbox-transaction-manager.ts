import { ClientMessageEnvelope, ServerMessage } from "../types/socket/protocol/messages";

export class TransactionManager {
  /**
   * The map of <transactionId, Transaction> representing outstanding requests.
   */
  private readonly outstandingRequestsMap: Map<string, Transaction> = new Map();

  /**
   * The queue of completed requests. This is a FIFO queue of the last N completed requests,
   * where N is {@link completedTransactionsToKeep}.
   */
  private readonly completedTransactionsQueue: Transaction[] = [];

  /**
   * Number of completed requests to keep in memory.
   */
  private readonly completedTransactionsToKeep: number;

  constructor(completedTransactionsToKeep: number = 10) {
    this.completedTransactionsToKeep = completedTransactionsToKeep;
  }

  public addOutstandingRequest(transactionId: string, request: ClientMessageEnvelope): void {
    const isOutstanding = this.outstandingRequestsMap.has(transactionId);
    if (isOutstanding) {
      throw new Error(`Transaction [${transactionId}] already has an outstanding request`);
    }

    const transaction: Transaction = {
      transactionId,
      request,
      response: null,
      start: new Date(),
      end: null,
    };

    this.outstandingRequestsMap.set(transactionId, transaction);
  }

  public addResponse(transactionId: string, response: ServerMessage): void {
    const transaction = this.outstandingRequestsMap.get(transactionId);
    if (transaction === undefined) {
      throw new Error(`Transaction [${transactionId}] does not have an outstanding request`);
    }

    transaction.response = response;
    transaction.end = new Date();

    // Move the transaction from the outstanding requests to the completed requests.
    this.outstandingRequestsMap.delete(transactionId);
    this.addCompletedTransaction(transaction);
  }

  public get outstandingRequests(): Transaction[] {
    return Array.from(this.outstandingRequestsMap.values());
  }

  public get completedTransactions(): Transaction[] {
    return this.completedTransactionsQueue;
  }

  public clearOutstandingRequests(): void {
    this.outstandingRequestsMap.clear();
  }

  /**
   * Adds a completed request to the queue.
   *
   * If the number of completed requests exceeds the maximum number of completed requests to keep,
   * remove the oldest completed request.
   */
  private addCompletedTransaction(transaction: Transaction): void {
    this.completedTransactionsQueue.push(transaction);

    if (this.completedTransactionsQueue.length > this.completedTransactionsToKeep) {
      this.completedTransactionsQueue.shift();
    }
  }
}

interface Transaction {
  /**
   * The transaction ID.
   */
  transactionId: string;

  /**
   * The request to the server.
   */
  request: ClientMessageEnvelope;

  /**
   * The response to the request.
   *
   * The response is null until the request is completed.
   */
  response: ServerMessage | null;

  /**
   * The start time of the transaction.
   */
  start: Date;

  /**
   * The end time of the transaction.
   */
  end: Date | null;
}
