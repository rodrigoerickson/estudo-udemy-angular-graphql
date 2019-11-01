import { InjectionToken } from '@angular/core';

const graphCollId = 'cjzsyt38x0xuy0103ba7jy6qe';

export interface GraphcoolConfig {
    simpleApi: string;
    subscriptionAPI: string;
    fileApi: string;
    fileDownloadURL: string;
}
export const GraphcoolConfig: GraphcoolConfig = {
    simpleApi:`https://api.graph.cool/simple/v1/${graphCollId}`,
    subscriptionAPI:`wss://subscriptions.graph.cool/v1/${graphCollId}`,
    fileApi:`https://api.graph.cool/file/v1/${graphCollId}`,
    fileDownloadURL:`https://files.graph.cool/${graphCollId}`
}

export const GRAPHCOOL_CONFIG = new InjectionToken<GraphcoolConfig>(
    'graphcool.config',
    {
        providedIn:'root',
        factory: ()=>{
            return GraphcoolConfig;
        }
    }
);