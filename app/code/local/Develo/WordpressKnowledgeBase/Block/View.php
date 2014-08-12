<?php
/**
 * Created by PhpStorm.
 * User: paul
 * Date: 11/08/2014
 * Time: 09:59
 */
class Develo_WordpressKnowledgeBase_Block_View extends Fishpig_Wordpress_Block_Category_View
{
    private $defaultNumberOfCategoriesPerRow = 3;

    public function getKnowledgeBaseCategoryId(){

        return Mage::getStoreConfig( 'develo_wordpressknowledgebase/global_config/category_id' );
    }

    public function getColumnClass(){

        $numberOfCategoriesPerRow = $this->getNumberPerRow();

        if( is_int( $numberOfCategoriesPerRow ) && $numberOfCategoriesPerRow < 1 )
            $numberOfCategoriesPerRow = $this->defaultNumberOfCategoriesPerRow;

        return 'col-md-' . 12 / $numberOfCategoriesPerRow;
    }

    public function getDisplayLimit(){

        return Mage::getStoreConfig( 'develo_wordpressknowledgebase/global_config/list_display_limit' );
    }

    public function getKnowledgeBaseCategory(){

        return Mage::getModel( 'wordpress/post_category' )->load( $this->getKnowledgeBaseCategoryId() );
    }

    public function getKnowledgeBaseCategories() {

        $category = $this->getKnowledgeBaseCategory();
        return $category->getChildrenCategories();
    }

    public function getNumberPerRow() {

        return Mage::getStoreConfig( 'develo_wordpressknowledgebase/global_config/number_per_row' );
    }

    public function displayPostList( $postCollection, $listItemClass = '', $listType = 'ul', $iconClass = 'icon' ) {

        $html =  '<' . $listType . '>';

        $postListDisplayLimit = $this->getDisplayLimit();

        $numberOfPosts = count( $postCollection );

        $counter = 0;

        foreach( $postCollection as $post ) {

            $hiddenClass = ( $postListDisplayLimit && $counter >= $postListDisplayLimit ) ?
                'hidden':
                '';

            $html .= '<li class="wordpress-knowledge-base-item ' . $listItemClass . ' ' . $hiddenClass .'">';

                if( $iconClass )
                    $html .= '<i class="' . $iconClass . '"></i>';

                $html .= '<a href="' . $post->getUrl() . '" title="' . $post->getPostTitle() . '">';
                $html .=    $post->getPostTitle();
                $html .= '</a>';

            $html .= '</li>';

            $counter++;
        }

        if( $numberOfPosts > $postListDisplayLimit )
            $html .= '<li class="view-all"><a href="#">View All</a></li>';

        $html .= '</ul>';

        return $html;
    }

    public function loadJQuery() {

        return Mage::getStoreConfig( 'develo_wordpressknowledgebase/global_config/load_jquery' );
    }

    public function getSearchUrl(){

        return DIRECTORY_SEPARATOR . 'knowledge-base' . DIRECTORY_SEPARATOR . 'search' . DIRECTORY_SEPARATOR . 'json';
    }
}