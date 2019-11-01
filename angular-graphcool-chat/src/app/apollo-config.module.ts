import { NgModule, Inject } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink, Operation } from 'apollo-link';
import { StorageKeys } from './storag-keys';
import { GRAPHCOOL_CONFIG, GraphcoolConfig } from './core/providers/graphcool.config.provider';

@NgModule({
    imports:[
        HttpClientModule,
        ApolloModule,
        HttpLinkModule
    ]
})
export class ApolloConfigModule {

    constructor(
        private apollo: Apollo,
        @Inject(GRAPHCOOL_CONFIG) private graphcoolConfig: GraphcoolConfig,
        private httpLink: HttpLink
    ) {
        const uri = this.graphcoolConfig.simpleApi;
        const http = httpLink.create({uri});

        const authMiddleware: ApolloLink = new ApolloLink((operation: Operation, forwad) =>{
            operation.setContext({
                headers: new HttpHeaders({
                    'Authorization': `Bearer ${this.getAuthToken()}`
                })
            })
            return forwad(operation);
        });

        const linkError = onError(({response, graphQLErrors, networkError }) => {
            if (graphQLErrors){
                graphQLErrors.map(({ message, locations, path }) =>
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                ),
                );
            }
            if (networkError){
                console.log(`[Network error]: ${networkError}`);
            } 
        });

        apollo.create({
            link: ApolloLink.from([
                linkError,
                authMiddleware.concat(http),
            ]),
            cache: new InMemoryCache()
        })
    }

    private getAuthToken():string{
        return window.localStorage.getItem(StorageKeys.AUTH_TOKEN);
    }
}