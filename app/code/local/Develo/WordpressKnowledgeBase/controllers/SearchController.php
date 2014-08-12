<?php

class Develo_WordpressKnowledgeBase_SearchController extends Fishpig_Wordpress_Controller_Abstract
{

    public function jsonAction()
    {
        $block = Mage::getBlockSingleton( 'wordpress/search_result' );

        $knowledgeBaseCategoryId = Mage::getStoreConfig( 'develo_wordpressknowledgebase/global_config/category_id' );
        $knowledgeBaseCategory = Mage::getModel( 'wordpress/post_category' )->load( $knowledgeBaseCategoryId );

        $knowledgeBaseChildCategories = $knowledgeBaseCategory->getChildrenCategories();
        $cats_ids = array();

        foreach($knowledgeBaseChildCategories as $cat){
            $cats_ids[] = $cat->getId();
        }

        $collection = $block->getPostCollection()
            ->addTermIdFilter( $cats_ids, 'category' )
            ->load();

        $this->getResponse()->setBody(
            Mage::helper('core')
                ->jsonEncode( $collection->toArray() )
        );

    }
}