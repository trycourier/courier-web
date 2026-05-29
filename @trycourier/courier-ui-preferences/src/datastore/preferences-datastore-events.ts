import { PreferencesSection, PreferencesTopic } from "../types/preferences";

/**
 * Events emitted by the preferences datastore.
 * @public
 */
export class CourierPreferencesDatastoreEvents {
  public onSectionsChange?(_sections: PreferencesSection[]): void {}
  public onTopicUpdate?(_topic: PreferencesTopic, _sectionId: string): void {}
  public onLoading?(_isLoading: boolean): void {}
  public onError?(_error: Error): void {}
}
